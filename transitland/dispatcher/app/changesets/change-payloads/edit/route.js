import Ember from 'ember';

export default Ember.Route.extend({
  model: function(params) {
    return this.store.find('change-payload', params['change_payload_id']);
  },
  actions: {
    delete: function() {
      var self = this;
      var model = self.currentModel;
      var changeset = model.get('changeset');
      const flashMessages = Ember.get(this, 'flashMessages');
      model.destroyRecord().then(() => {
        flashMessages.success("Change payload deleted!");
        self.transitionTo('changesets.show', changeset);
      }).catch(function(error) {
        flashMessages.danger(`Error(s) deleting change payload: ${error.message}`);
      });
    },
    update: function() {
      var self = this;
      var model = self.currentModel;
      var changeset = model.get('changeset');
      const flashMessages = Ember.get(this, 'flashMessages');
      model.set('payload', JSON.parse(model.get('stringified_payload')));
      model.save().then(function() {
        flashMessages.success("Change payload updated!");
        self.transitionTo('changesets.show', changeset);
      }).catch(function(error) {
        flashMessages.danger(`Error(s) updating change payload: ${error.message}`);
      });
    }
  }
});
