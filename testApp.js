var {log} = require('./jsEasyLog');
log.init("TestApp",'Debug')
log.lvl(3)

log.debug("Print debug")
log.error("Print Error")

function myfnc(str)
{
    console.log(str)
}

log.override('Debug',myfnc);

log.debug("Print debug through overide function")
