var {log} = require('./jsEasyLog');
log.init("TestApp")

log.debug("Print debug")
log.error("Print Error")

function myfnc(str)
{
    console.log(str)
}

log.override('Debug',myfnc);

log.debug("Print debug through overide function")
