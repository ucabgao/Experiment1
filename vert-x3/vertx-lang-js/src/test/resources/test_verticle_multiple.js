//We want to make sure the body is executed every time the verticle is deployed

vertx.eventBus().send("fooaddress", "blah");

exports.__vertxRunModule = null;



