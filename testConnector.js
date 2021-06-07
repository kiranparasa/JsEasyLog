var {log} = require('./jsEasyLog');
var {connector} = require('./connector_template');
log.init("TestApp")
connector.divert(log,'Debug')

log.debug("This is debug will be printed through the overloaded connector")
log.error("This is error will be printed to default mechanism")
