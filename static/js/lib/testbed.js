$(function() {
	
	var socketPort = $('#socketPort').val()
	var host = $('#host').val()
	
	$('#myAffix').affix({
		offset: {
			top: 450
		}
	})
	$('#myAffix').on('affixed.bs.affix',function() {
		$('#myAffixHelper').show();
	});
	$('#myAffix').on('affixed-top.bs.affix',function() {
		$('#myAffixHelper').hide();
	});
	var testDoc;
	var $console = $('#console');
	var $commands = $('#commands');
	function updateConsole(msg) {
		var args = $.makeArray(arguments)
		
		var _cmd = $commands.html();
		var _time = new Date().getTime();
		if(args.length > 1) {
			_cmd =  '<a href="#' + _time + '">' + args[0]  + "</a>\n---------\n"  + _cmd;
		} else {
			_cmd =   args[0]  + "\n---------\n"  + _cmd;
		}
		$commands.html(_cmd);
		
		//args.shift();
		function sortObject(obj) {
			if(typeof obj !== 'object')
				return obj
			var temp = {};
			var keys = [];
			for(var key in obj)
				keys.push(key);
			keys.sort();
			for(var index in keys)
				temp[keys[index]] = sortObject(obj[keys[index]]);       
			return temp;
		}
		if(args.length > 1) {
			if('object' !== args[0])args.reverse();
			for(var i=0; i < args.length; i++) {
				var v = args[i];
				if('function' !== typeof v) {
					var _msg = $console.html();
					if('object' === typeof v) {
						try {
							v = JSON.stringify(sortObject(v), null, 4);
						} catch(e) {
						
						}
					}
					if(i === 0) {
						_msg = '<a name="' + _time + '"></a>' + v  + "\n----------------------------------\n" + _msg;
					} else {
						_msg =  v  + "\n-- --\n" + _msg;
					}
					
					$console.html(_msg);
					//console.log(v,_msg)
				}
			}
		}
	}
	
	var socketLists = io('//' + host + ':' + socketPort + '/lists');
	function startInterval() {
		$('#connected').css('background-color','lightgreen');
		setInterval(() => {
			//debug('heartbeat', Sockets.io.connected);
			if(socketLists.connected) {
				$('#connected').css('background-color','lightgreen');
			} else {
				$('#connected').css('background-color','lightpink');
			}
		},2500);
	}
	$('#connected').css('background-color','lightpink');
	socketLists.on('connect',function(data) {
		console.log('connected');
		updateConsole('connected');
		startInterval();
	});
	socketLists.on('disconnected',function(data) {
		console.log('disconnected');
		updateConsole('disconnected');
	});
	socketLists.on('connect-error',function(err) {
		console.log('connect-error',err);
		updateConsole('connect-error',err);
	});
	socketLists.on('error',function(err) {
		console.log('error',err);
		updateConsole('error',err);
	});
	/*
	socketLists.on('doc',function(data) {
		console.log('doc',data);
		updateConsole('doc',data)
	});
	* */
	socketLists.on('doc',function(data) {
		console.log('doc',data);
		updateConsole('doc:'+data.path,data);
		$('#pre').css('background-color','initial');
	});
	socketLists.on('doc:get',function(data) {
		console.log('doc:get',data);
		updateConsole('doc:get',data);
		$('#pre').css('background-color','initial');
	});
	socketLists.on('doc:save',function(data) {
		console.log('doc:save',data);
		updateConsole('doc:save',data);
		$('#pre').css('background-color','initial');
	});
	socketLists.on('doc:created',function(data) {
		console.log('doc:created',data);
		updateConsole('doc:created',data);
		$('#pre').css('background-color','initial');
	});
	socketLists.on('doc:updated',function(data) {
		console.log('doc:updated',data);
		updateConsole('doc:updated',data);
		$('#pre').css('background-color','initial');
	});
	socketLists.on('doc:updatedField',function(data) {
		console.log('doc:updatedField',data);
		updateConsole('doc:updatedField',data);
		$('#pre').css('background-color','initial');
	});
	socketLists.on('field:54c87f95cdaa43333c09fac3:title',function(data) {
		console.log('doc:id:title',data);
		updateConsole('field:54c87f95cdaa43333c09fac3:title',data);
		$('#pre').css('background-color','initial');
	});
	socketLists.on('list',function(data) {
		console.log('list',data);
		updateConsole('list',data);
		$('#pre').css('background-color','initial');
	});
	
	//socketLists.emit('list',{list:'RomBox'});

	$('#runapi').click(function(e){
		e.preventDefault();
		var emit = $('#emit').val();
		
		var $path = $('#list').val();
		var url = '/api/v0/json/' + $path;
		var $id = $('#id').val();
		
		if(emit === 'list') {
			url += '/list/';
		} else
		if(emit === 'find') {
			url += '/find/';
		} else
		if(emit === 'create') {
			url += '/create/';
		} else
		if(emit === 'update') {
			url += '/' + $id + '/update/';
		} else
		if(emit === 'get') {
			url += '/' + $id + '/';
		} else
		if(emit === 'updateField') {
			url += '/' + $id + '/updateField/';
		} else
		if(emit === 'remove') {
			url += '/' + $id + '/remove/';
		} else {
			url += '/' + emit + '/';
		}
		var finish = $('#testbedform').serialize();
		url = url + '?' + finish;
		$.ajax({
			url: url
		})
		.done(function( resp,status,xhr ) {
			updateConsole('API: ' + emit, url, resp);	
		});
		
	});	
	
	$('#clearConsole').click(function(e){
		e.preventDefault();
		$('#console').text('');
		$('#commands').text('');
	});
	$('#runsock').click(function(e){
		e.preventDefault();
		var emit = $('#emit').val();
		var data = $('#testbedform').serializeFormJSON();
		data.doc = $('#testbedform').serializeFormJSON();
		delete data.path;
		delete data.doc.path;
		updateConsole('emit: ' + emit)
		console.log('send:',data)
		socketLists.emit(emit,data);
		
	});	
	
	$(document).on('change','.changeme',function(e) {
		var next = $(':input:eq(' + ($(':input').index(this) + 1) + ')')
		//console.log('changeme', e.target.value, next.attr('name'), next);
		next.attr('name', e.target.value);
		var aa = $(this).parent().parent().next().find('span');
		console.log(aa)
		aa.html(e.target.value);
	});
	
	$(document).on('click','.deleteRow',function(e) {
		var parent = $(this).parent().parent().remove();
	});
	
	$('.addinputs').click(function(click) {
			var div = '<div class="row"><div class="col-xs-4"><div class="form-group input-group"><span class="input-group-addon input-group-sm coinstamp">key</span><input type="text"  name="key[]"  class="changeme form-control coinstamp"></div></div><div class="col-xs-7"><div class="form-group input-group"><span class="input-group-addon input-group-sm coinstamp"></span><input type="text"  name="val[]" class="form-control coinstamp" placeholder="value"></div></div><div class="col-xs-1"><span class="glyphicon glyphicon-trash text-danger deleteRow"></span></div></div>';
			$('#addRowHere').before(div)
	})
	$.fn.serializeFormJSON = function () {

        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
});
