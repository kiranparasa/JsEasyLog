/*
  Author : Parasa Kiran
  https://github.com/kiranparasa/JsEasyLog
  
  */

LOG_LEVELS = {'Debug':3,'Info':2,'Error':1}
class jsEasyLog
{

  nfn()
  {/* This is null file */}

  init(name,log_level='Debug',stack_trc=false)
  {
    this.appName = name
    this.output = {}
    this.output['Error'] = this.stdout;
    this.output['Debug'] = this.stdout;
    this.output['Info'] =  this.stdout;

    this.pipe['Error'] = this.nfn;
    this.pipe['Debug'] = this.nfn;
    this.pipe['Info'] =  this.nfn;

    this.stack_trc = stack_trc;
    this.log_level = LOG_LEVELS[log_level];
    this.log_st = {"msg":"","json":""}
    this.log = {"timestamp":"",
                  "app":name, 
                  "server":"",
                  "processID":"",
                  "line":0,
                  "filename":"",
                  "logLevel":"",
                  "message":"",
                  "stackTrace":""
                }
    /*
    Request NMS for logging rules for this app.
    nms_info = nms.log_pref(this.appName);
    */
  }

  /* Override default stdout output */
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

  /* Pipe the output to external connectors */
  pipe(type,fn)
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

    this.pipe[type] = fn;
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
    if(this.log_level < LOG_LEVELS['Debug']){
      return;
    }

    var st=this.trace("");
    this.log["timestamp"] = this.currentTime();
    this.log["logLevel"] = "Debug";
    this.log["message"] = args.join();

    this.log_st["json"] = JSON.stringify(this.log);
    this.log_st["msg"]= this.currentTime() + "::Debug::" + this.appName + "::"+ st +"::"+this.log['message'];
    this.pipeIt("Debug",this.log_st) 
  }
 
  error(...args)
  {
    var st=this.trace("");
    this.log["timestamp"] = this.currentTime();
    this.log["logLevel"] = "Error";
    this.log['message'] = args.join();
    this.log_st['json'] =  JSON.stringify(this.log);
    this.log_st['msg']= this.currentTime() + "::Error::" + this.appName + "::"+ st +"::"+this.log['message'];
    this.pipeIt("Error",this.log_st)
  }
 
  info(...args)
  {
    if(this.log_level < LOG_LEVELS['Info']){
      return;
    }
    var st=this.trace("");
    this.log["timestamp"] = this.currentTime();
    this.log["logLevel"] = "Info";
    this.log['message'] = args.join();
    this.log_st["json"] = JSON.stringify(this.log);
    this.log_st['msg']= this.currentTime() + "::Info1::" + this.appName + "::"+ st +"::"+this.log['message'];
    this.pipeIt("Info",this.log_st)
  }

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
    this.output[lvl](s['msg']);
    this.pipe[lvl](s['json']);
  }
}

var log = new jsEasyLog()
module.exports = { log };
