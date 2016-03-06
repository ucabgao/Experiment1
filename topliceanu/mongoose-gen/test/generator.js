var assert = require('assert');
var fs = require('fs');

var _ = require('underscore');
var mongoose = require('mongoose');
var Q = require('q')

var db = require('./fixtures/db');
var descriptor = require('./fixtures/descriptor');
var generator = require('./../');
var simpleDescriptor = require('./fixtures/simple-descriptor');


describe('mongoose-gen', function () {

    before(function () {
        // NOTE: modify test/fixtures/db.json to change connection.
        this.connection = mongoose.connect('mongodb://'+db.host+':'+db.port+'/'+db.name);
    });

    describe('register custom methods', function () {

        it('.setValidator() should add a validator', function () {
            var customFn = function () {
                return true;
            };
            var customName = 'customValidator';
            generator.setValidator(customName, customFn);
            assert.equal(generator._hash.validator[customName], customFn);
        });

        it('.setSetter() should add a customSetter', function () {
            var customFn = function (value) {
                return value;
            };
            var customName = 'customSet';
            generator.setSetter(customName, customFn);
            assert.equal(generator._hash.setter[customName], customFn);
        });

        it('.setGetter() should add a customGetter', function () {
            var customFn = function (value) {
                return value;
            };
            var customName = 'customGet';
            generator.setGetter(customName, customFn);
            assert.equal(generator._hash.getter[customName], customFn);
        });

        it('.setDefault() should add a defaultString', function () {
            var customFn = function () {
                return 'default';
            };
            var customName = 'defaultString';
            generator.setDefault(customName, customFn);
            assert.equal(generator._hash.default[customName], customFn);
        });

        it('.setDefault() should add defaults', function () {
            [
                'String',
                'Number',
                'Boolean',
                'Date',
                'Buffer',
                'ObjectId',
                'Mixed'
            ].forEach( function (type) {
                var name = 'default'+type;
                var fn = function () {
                    switch (type) {
                        case 'String': return 'default';
                        case 'Number': return 1;
                        case 'Boolean': return true;
                        case 'Date': return new Date(111111111111111);
                        case 'Buffer': return new Buffer('default');
                        case 'ObjectId': return 1;
                        case 'Mixed': return {};
                    }
                };
                generator.setDefault(name, fn);
                assert.equal(generator._hash.default[name], fn);
            });
        });

        it('._get() should retrieve the correct function', function () {
            generator._get('validator', 'customValidator');
        });

        it('._get() should throw an error when the required modifier is not found', function () {
            assert.throws(function () {
                generator._get('validator', 'undefinedValidator');
            }, Error, 'Throws error when validator was not registered previously');
        });

        it('._matchType() should match the correct type', function () {
            var Type1 = generator._matchType('String');
            var Type2 = generator._matchType('Number');
            var Type3 = generator._matchType('Boolean');
            var Type4 = generator._matchType('Date');
            var Type5 = generator._matchType('Buffer');
            var Type6 = generator._matchType('ObjectId');
            var Type7 = generator._matchType('Mixed');

            assert.equal(Type1, String);
            assert.equal(Type2, Number);
            assert.equal(Type3, Boolean);
            assert.equal(Type4, Date);
            assert.equal(Type5, Buffer);
            assert.equal(Type6, mongoose.Schema.ObjectId);
            assert.equal(Type7, mongoose.Schema.Types.Mixed);
        });

        it('._matchType() should throw when an unknown type is requested', function () {
            assert.throws(function () {
                var Type = generator.matchType('NumberLong');
            }, Error, 'NumberLong is not yet defined as a type');
        });

        it('._check() should return a regexp when match options is given', function () {
            var r = generator._check('match', '^test$');
            assert.ok(r.test('test'));
        });

        it('._check() should throw when regexp param is not string', function () {
            assert.throws(function () {
                var r = generator._check('match', 12345);
            }, Error, 'Param for match is not string to be used with RegExp');
        });

        it('._check() should throw for an unhandled type', function () {
            assert.throws(function () {
                var r = generator._check('email');
            }, Error, 'Email type is not registered');
        });

    });

    describe('.getSchema()', function () {

        it('should generate a new Schema instance', function () {
            var TestSchema = generator.getSchema(simpleDescriptor, mongoose);
            assert.ok(TestSchema instanceof mongoose.Schema,
                      'should be instance of mongoose.Schema');

            this.Model = this.connection.model('Test', TestSchema);
        });

        it('should store the model in the database', function (done) {
            var _this = this;
            var instance = new this.Model({prop1: 'Test'});
            instance.save( function (err) {
                if(err){
                    return done(err);
                }
                assert.ok(_.isString(instance.id), 'instance now has a '+
                                 'String id, which means it was saved on disk');
                _this.Model.find(function (err, instances) {
                    if(err){
                        return done(err);
                    }
                    if(!instances || !instances.length || instances.length === 0){
                        return done(new Error('No instances found'));
                    }
                    instance = instances[0];
                    assert.equal(instance.prop1, 'Test', 'same value as the one saved');
                    done();
                });
            });
        });

        after(function (done) {
            // Cleanup the database collection.
            // NOTE: an application cannot delete a database so if you want to
            // keep you mongodb server clean you have to delete the test
            // database manually.
            this.Model.collection.remove(done);
        });
    });

    describe('DBRef support', function () {

        before(function () {
            // Define schemas.
            var PlainSchema = new mongoose.Schema({
                'key': {type: String}
            });
            var GenSchema = generator.getSchema({
                "key": {"type": "String"},
                "plain": {"type": 'ObjectId', ref: 'Plain'}
            }, mongoose);

            // Define models.
            this.PlainModel = mongoose.model('PlainModel', PlainSchema);
            this.GenModel = mongoose.model('GenModel', GenSchema);
        });

        it('should store data for both normally created models and '+
           '`mongoose-gen` created models the same way', function (done) {
            var _this = this;

            Q().then(function () {
                _this.plain = new _this.PlainModel({key: 'plain'});
                return Q.ninvoke(_this.plain, 'save');
            }).then(function () {
                _this.gen = new _this.GenModel({key: 'gen', plain: _this.plain});
                return Q.ninvoke(_this.gen, 'save');
            }).then(function () {
                return Q.all([
                    Q.ninvoke(_this.PlainModel, 'findOne'),
                    Q.ninvoke(_this.GenModel, 'findOne')
                ])
            }).spread(function (plain, gen) {
                assert.ok(gen.id, 'doc should have been stored');
                assert.equal(gen.key, 'gen', 'should have stored the key');
                assert.equal(gen.plain, plain.id, 'should have linked the other document');
                assert.ok(plain.id, 'doc should have been stored');
                assert.equal(plain.key, 'plain', 'should have stored the key');
            }).then(function () {
                done();
            }, done)
        });

        after(function (done) {
            // Cleanup the collections.
            var _this = this;
            this.PlainModel.collection.remove( function (err) {
                if (err) return done(err);
                _this.GenModel.collection.remove(done);
            });
        });
    });

    describe('nested', function () {

        it('should eneble deeply nested documents', function (done) {
            var BlogPostSchema = generator.getSchema({
                'title': {type: 'string'},
                'body': {type: 'string'},
                'comments': [{
                    'text': {type: 'string'},
                }]
            }, mongoose);
            BlogPostModel = mongoose.model('BlogPost', BlogPostSchema);

            var data = {
                'title': 'My awesome ideea',
                'body': 'The secret to the universe is...',
                'comments': [
                    {'text': 'This is marvelous!'},
                    {'text': 'Amazing!'}
                ]
            };
            var newBlog = new BlogPostModel(data);
            newBlog.save(function (error) {
                if (error) return done(error);

                BlogPostModel.findOne(function (error, blogPost) {
                    if (error) return done(error);

                    assert.equal(blogPost.title, data.title, 'same title');
                    assert.equal(blogPost.body, data.body, 'same body');
                    assert.equal(blogPost.comments.length, data.comments.length, 'same comments');
                    assert.equal(blogPost.comments[0].text, data.comments[0].text);
                    assert.equal(blogPost.comments[1].text, data.comments[1].text);
                    done()
                });
            });
        });

    });
});
