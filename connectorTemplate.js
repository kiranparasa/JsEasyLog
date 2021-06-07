/* Use this template to extend output capabilities
*/
class connector_template
{
    pipeIt(msg)
    {
      console.log("This is printed using a connector. Modify here according to you needs");
    }
    divert(log_handler, type)
    {
        log_handler.override(type, this.pipeIt);
    }
}

var connector = new connector_template();

module.exports = {connector}
