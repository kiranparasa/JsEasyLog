/*
  Author : Parasa Kiran
  https://github.com/kiranparasa/JsEasyLog
  
  */

class jsEasyLog
{
  init(name,stack_trc=false)
  {
    this.appName = name
    this.output = {}
    this.output['Error'] = this.stdout;
    this.output['Debug'] = this.stdout;
    this.output['Info'] =  this.stdout;
    this.stack_trc = stack_trc;

    this.log = {"timestamp":"",
                  "app":name, 
                  "line":0,
                  "filename":"",
                  "logLevel":"",
                  "message":"",
                }
    /*
    Request log settings from the central repository based on the app name
    nms_info = nms.log_pref(this.appName);
    */
  }

  /* Override the output stream function to a custom function */
  override(type,fn)
  {
    switch(type)
    {
      case 'Debug':
        case 'Error':
          case 'Info':
            break;
      default:
        console.log("Invalid log level " + type)
        return;
    }

    this.output[type] = fn;
  }

  stdout(st)
  {
    console.log(st)
  }


  currentTime()
  {
    var d = new Date();
    var n = d.toUTCString();
    return n
  }

  debug(...args)
  {
    var st=this.trace("");
    this.log["timestamp"] = this.currentTime();
    this.log["logLevel"] = "Debug";
    this.log['message'] = args.join();
    this.pipeIt("Debug", this.log["timestamp"] + "::DEB::" + this.appName + "::"+ st +"::"+this.log['message'])
  }
 
  error(...args)
  {
    var st=this.trace("");
    this.log["timestamp"] = this.currentTime();
    this.log["logLevel"] = "Error";
    this.log['message'] = args.join();
    this.pipeIt("Error", this.currentTime() + "::ERR::" + this.appName + "::"+ st +"::"+this.log['message'])    
  }
 
  info(...args)
  {
    var st=this.trace("");
    this.log["timestamp"] = this.currentTime();
    this.log["logLevel"] = "Info";
    this.log['message'] = args.join();
    this.pipeIt("Info",this.currentTime() + "::INF::" + this.appName + "::"+ st +"::"+this.log['message'])
  }

  /*
  Gets the filename and linenumber from the backtrace
  */
  
  trace(s) {
      const err = new Error();

      var er = err.stack;
      var vl=er.split("\n");
      var line  = vl[vl.length>3?3:0];
      var words = line.split("\\");
      var skimmed_word = words[words.length-1].replace(")","");
      
      var filename,lineno,junk;
      [filename,lineno,junk]=skimmed_word.split(":");
      this.log["filename"] = filename;
      this.log["line"] = lineno
      var final_str = skimmed_word;
      if (this.stack_trc)
        final_str += "("+er+")"
      //console.log(er)
      return final_str;
  }

  pipeIt(lvl,s)
  {
    this.output[lvl](s);
  }
}

var log = new jsEasyLog()
module.exports = { log };
