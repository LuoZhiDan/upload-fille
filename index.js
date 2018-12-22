require('expose-loader?$!jquery');
require('expose-loader?_!lodash');

function Model(){
    this.init();
}

Model.prototype = {
    init: function(){
        this._files = [];
        this._map = {};
        this._length = 0; 
    },

    /**
     * 添加文件
     * @param {*} file 
     */
    addFile: function( file ){
        
        var fileType = (/(\.psd|\.svg)$/).exec( file.name );

        // 判断类型 svg | psd
        if(!fileType){
            console.log('文件类型不准确');
            return;
        }
        fileType = fileType[0];
    
        if(this._map[ fileType ]){
            this._map[ fileType ] = file;
        } else {
            this._map[key] = file;
            this._length++;
        }
    },

    /**
     * 删除文件
     */
    removeFile: function( file ){
        var key = file.name + file.size + file.lastModified;
        if(this._map[key]){
            this._length--;
            delete this._map[key];
            this._files = _.remove(this._files, function( o ){
                var key = file.name + file.size + file.lastModified;
                var key1 = o.name + o.size + o.lastModified;
                return key == key1;
            });
        }
    },

    getFiles: function( ){
        if(!this._length) return null;

        var form = new FormData();
        this._files.map(function( item ){
            form.append('file', item);
        });
        return form;
    }
}

var model = new Model();



$('#submit').click(function(){
    var form = model.getFiles();

    if(!form){// 文件为空
    }

    $.ajax({
        url: '/upload',
        data: form,
        type:"post",
        processData:false, 
        contentType:false, 
        success:( res ) =>{
            model.init();
        },
        xhr: function(){
            var xhr = $.ajaxSettings.xhr();
            if(xhr.upload){
                xhr.upload.addEventListener('progress', progressHandlingFunction, false);
            }
            return xhr;
        }
    })
});

function progressHandlingFunction( ev ){
    $('#progress').val(ev.loaded/ev.total);
}

document.addEventListener("drop",function(e){  //拖离   
    e.preventDefault();      
})  
document.addEventListener("dragleave",function(e){  //拖后放   
    e.preventDefault();      
})  
document.addEventListener("dragenter",function(e){  //拖进  
    e.preventDefault();      
})  
document.addEventListener("dragover",function(e){  //拖来拖去    
    e.preventDefault();      
}) 

// 拖拽上传
$('#box').on("drop",function(e){  //拖离   
    e.preventDefault();
    var files= e.originalEvent.dataTransfer.files;
    for(var i = 0, il = files.length; i<il; i++){
        model.addFile( files[i] );
        
    }
});

// 点击上传
$('#box').on("click",function(e){  //拖离   
    e.preventDefault();
    $('#file').click();
});

$('#file').on('change', function(){
    var files = this.files;
    for(var i = 0, il = files.length; i<il; i++){
        model.addFile( files[i] );
    }
});
