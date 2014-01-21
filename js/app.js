$(function() {
    var taskTable;
    var currentEditRow, currentEditName, currentEditDetails, currentEditOriginator;
    function renderList(){
        $.getJSON('srv/taskTable.php', function(responseTable){
            //console.log(taskTable);
            var tbl_body= "";
            var count=1;
            taskTable = responseTable;
            $.each(taskTable, function(){
                var tbl_row= "";
                tbl_row += "<td>" + count + "</td>";
                tbl_row += "<td>" + this['task_name'] + "</td>";
                tbl_row += "<td>" + this['task_details'] + "</td>";
                tbl_row += "<td>" + this['originator'] + "</td>";


                tbl_row += "<td><div class='priority_buttons'>";

                var aDate = new Date(Date.parse(this['task_priority']));
                //console.log(aDate);
                tbl_row += "<strong>" + -1*((new Date() - aDate)/1000/3600).toFixed(2) + "</strong>" + " Hours Remaining <img src='img/up_arrow.png' class='up_button' alt='Increase Priority' title='Increase priority by 3 hours.'>";
                tbl_row += "<img src='img/down_arrow.png' class='down_button' alt='Decrease Priority' title='Decrease priority by 3 hours.'></div></td>";

                tbl_row += "<td><div class='priority_buttons'><img src='img/edit.png' class='edit_button' alt='Edit Task' title='Edit task details.'>";
                tbl_row+= "<div class='edit_dialog' title='Task #" + count + " Info' style='display: none' id='edit_dialog" + count +"'></div>";
                //console.log(tbl_row);
                tbl_row += "<img src='img/close.png' class='delete_button' alt='Delete Task' title='Delete the task.'></div></td>";

                tbl_body+= "<tr>" + tbl_row + "</tr>";
                count++;
            });
            $('#taskQueueBody').html(tbl_body);
            //$('#taskQueue > tbody:last').append(tbl_body);
        });
    };

    //tooltip mouseovers
    $(document).on({
        mouseenter: function(){
            if(!$(this).data('tooltip')){
                $(this).tooltip().tooltip('open');
            }
        }
    }, ".priority_buttons > .up_button , .down_button , .edit_button , .delete_button");

    //Delete task
    $(document).on({
        click: function(){
            var sure = confirm('Are you sure you want to delete this task?');
            if(sure){
                var tempv=$(this).parent().parent().parent()[0] ;
                $.getJSON('srv/deleteTask.php', {taskID:taskTable[tempv.rowIndex-1].task_id} , function(answer){
                    if(answer === true){

                        /** red delete animation
                        $(this).parent().parent()[0].animate({'background-color': 'red'}, 'very slow', function(){

                        });
                        **/
                        taskTable.splice(tempv.rowIndex-1, 1);
                        //console.log(taskTable);
                        $(tempv).fadeOut('slow');
                        renderList();
                    }
                });
            }
        }
    }, ".priority_buttons > .delete_button");

    //Increase task priority
    $(document).on({
        click: function(){
            var tempv=$(this).parent().parent().parent()[0]
            var data2 = {
                taskList : taskTable,
                taskID : taskTable[tempv.rowIndex-1].task_id,
                priorityChange: 0
            };
            //console.log('hoohoo');
            $.getJSON('srv/changePriority2.php', data2 , function(answer){
                console.log(answer);
            });
            $(this).parent().parent().animate({'background-color': '#66FF00'}, 'very slow', function(){
                renderList();
                $(this).parent().parent().animate({'background-color': 'white'}, 'very slow');
            });
            /**
            $(this).parent().parent().animate({'background-color': '#66FF00'}, 'very slow', function(){
            $(this).parent().parent().animate({'background-color': 'white'}, 'very slow', function(){
                renderList();
            });});
            **/
            //console.log($(this).parent().parent());
            //renderList();
            //console.log(tempv);
            //console.log(taskTable[tempv-1].task_id);
            //$(this)
            //$(this).css({width:"15%",height:"15%"});
        }
    }, ".priority_buttons > .up_button");

    //Decrease task priority
    $(document).on({
        click: function(){
            var tempv=$(this).parent().parent().parent()[0]
            var data2 = {
                taskList : taskTable,
                taskID : taskTable[tempv.rowIndex-1].task_id,
                priorityChange: 1
            };
            //console.log('hoohoo');
            $.getJSON('srv/changePriority2.php', data2 , function(answer){
                console.log(answer);
            });
            $(this).parent().parent().animate({'background-color': '#FF6633'}, 'very slow',function(){
            $(this).parent().parent().animate({'background-color': 'white'}, 'very slow', function(){
                renderList();
            });});
            //console.log(tempv);
            //console.log(taskTable[tempv-1].task_id);
            //$(this)
            //$(this).css({width:"15%",height:"15%"});
        }
    }, ".priority_buttons > .down_button");

    //EDIT A TASK
    $(document).on({
        click: function(){
            var testit=$(this).parent().parent().parent();
            //console.log(testit.children('td:nth-child(2)')[0].innerHTML);
            var curRow =$(this).parent().parent().parent()[0].rowIndex;
            //console.log(editD);
            $('#edit_dialog' + curRow).html("<form id='edit-specialForm" + curRow + "' class='form-group'><h1 align='center'><strong>Edit Task Form</strong></h1><br><input type='text' id='edit-taskname" + curRow + "' class='form-control edit-control' placeholder='Task Name'/><br><br><textarea id='edit-taskdetails" + curRow + "' class='form-control edit-control' placeholder='Task Instructions and Details'></textarea><br><br><input type='text' id='edit-originator" + curRow + "' class='form-control edit-control' placeholder='Originator'/><br><br><select id='edit-priority-select" + curRow + "' class='form-control'><option value = '1'>Priority - As Soon As Possible</option><option value = '2'>Priority - By the End of the Day</option><option value = '30'>Priority - By the End of the Week</option></select><br><button type='button' id='edit-task-button" + curRow + "' class='btn btn-warning editbuttons editsubmit' disabled><strong>Submit Edit</strong></button><button type='button' id='cancel-edit-button" + curRow + "' class='btn btn-danger editbuttons canceledit'><strong>Cancel Edit</strong></button></form>");
            //console.log(testit);
            currentEditName= testit.children('td:nth-child(2)')[0].innerHTML;
            currentEditDetails= testit.children('td:nth-child(3)')[0].innerHTML;
            currentEditOriginator= testit.children('td:nth-child(4)')[0].innerHTML;
            $('#edit-taskname' + curRow).val(testit.children('td:nth-child(2)')[0].innerHTML);
            $('#edit-taskdetails' + curRow).val(testit.children('td:nth-child(3)')[0].innerHTML);
            $('#edit-originator' + curRow).val(testit.children('td:nth-child(4)')[0].innerHTML);
            //change the html of the dialog to recreate the task input form
            //console.log($(this).parent().parent().parent()[0].rowIndex);//     ,contains('<td>1<td>')"));
            $('#edit_dialog' + curRow).dialog({autoOpen: false, modal:true, draggable:true, minWidth:350}).dialog('open');
            //console.log($(this).parent().parent().parent()[0].rowIndex);
            currentEditRow = curRow;
        }

    }, ".priority_buttons > .edit_button");

    //close edit task window
    $(document).on({
        click: function(){
            //console.log(curRow2);
            $('#edit_dialog' + currentEditRow).dialog('close');
        }
    }, ".canceledit");

    //enlarge editing icons
    $(document).on({
        mouseenter: function(){
            //console.log(this);
            $(this).width(35);
            $(this).height(35);
            //$(this).css({width:"15%",height:"15%"});
        },
        mouseleave: function(){
            $(this).width(25);
            $(this).height(25);
            //$(this).css({width:"10.5%",height:"10.5%"});
        }
    }, ".priority_buttons > img");

    function task_sort(a, b) {
        var a2 = a.task_priority.split(/[- :]/);
        var a2date = new Date(a2[0], a2[1] - 1, a2[2], a2[3] || 0, a2[4] || 0, a2[5] || 0);
        var b2 = b.task_priority.split(/[- :]/);
        var b2date = new Date(b2[0], b2[1] - 1, b2[2], b2[3] || 0, b2[4] || 0, b2[5] || 0);

        return a2date.getTime() - b2date.getTime();
    };
    renderList();
    //edit form input validation
    $(document).on({
        'focus blur keyup': function() {
            //console.log(currentEditRow);
            //console.log(currentEditName);
            //console.log($('#edit-taskname' + currentEditRow).val()==currentEditName);
            var valid = false;
            if($('#edit-taskname' + currentEditRow).val()&&$('#edit-taskname' + currentEditRow).val() != currentEditName){
                valid=true;
                console.log('name ' + valid);
                //return false;
            }
            if($('#edit-taskdetails' + currentEditRow).val()&&$('#edit-taskdetails' + currentEditRow).val() != currentEditDetails){
                valid=true;
                console.log('details ' + valid);
                //return false;
            }
            if($('#edit-originator' + currentEditRow).val()&&$('#edit-originator' + currentEditRow).val() != currentEditOriginator){
                valid=true;
                console.log('originator ' + valid);
                //return false;
            }
            /**
            $('.edit-control').each(function(a) {
                if( !$(this).val() ){ // || $(this).val() == ) {
                    valid = false;
                    return false; // form is not valid so no need to go any further
                }
            });
            **/

            if (valid) {
                $('#edit-task-button' + currentEditRow).prop('disabled', false);
                $('#edit-task-button' + currentEditRow).addClass('btn-success').removeClass('btn-warning');
            }
            else {
                $('#edit-task-button' + currentEditRow).prop('disabled', true);
                $('#edit-task-button' + currentEditRow).removeClass('btn-success').addClass('btn-warning');
            }
        }
    }, '.edit-control');
    //});
    //input validation
    $('#specialForm .form-control').on(
        { 'focus blur keyup': function() {
            var valid = true;
            $('#specialForm .form-control').each(function(a) {
                if( !$(this).val() ) {
                    valid = false;
                    return false; // form is not valid so no need to go any further
                }
            });

            if (valid) {
                $('#submit-task-button').prop('disabled', false);
                $('#submit-task-button').addClass('btn-success').removeClass('btn-danger');
            }
            else {
                $('#submit-task-button').prop('disabled', true);
                $('#submit-task-button').removeClass('btn-success').addClass('btn-danger');
            }
        }
    });
	$('#submit-task-button').click(function() {
		var data = {
			taskName : $('#taskname').val(),
			taskDetails : $('#taskdetails').val(),
			taskPriority : $('#priority-select').val(),
			taskOriginator : $('#originator').val(),
			taskWorkers : ["Eric"]
		};
        var successCheck;
		//console.log(data);
		$.getJSON('srv/createTask.php', data, function(checker) {
            //console.log(checker);
            //console.log(checker.successCheck);
            if( checker.successCheck == 'true'){
                $('input[type="text"], textarea').val("");
                $('select').val("1");
                $('#submit-task-button').prop('disabled', true);
                $('#submit-task-button').removeClass('btn-success').addClass('btn-danger');
                $('#checksuccess').css('visibility', 'visible');
                $('#checksuccess').css('color', 'green');
                taskTable.push(checker.taskInfo);
                taskTable.sort(task_sort);
                //console.log(taskTable);

                        var tbl_body= "";
                        var count=1;
                        $.each(taskTable, function(){
                            var tbl_row= "";
                            tbl_row += "<td>" + count + "</td>";
                            tbl_row += "<td>" + this['task_name'] + "</td>";
                            tbl_row += "<td>" + this['task_details'] + "</td>";
                            tbl_row += "<td>" + this['originator'] + "</td>";
                            tbl_row += "<td><div class='priority_buttons'>";

                            var aDate = new Date(Date.parse(this['task_priority']));
                            //console.log(aDate);
                            tbl_row += "<strong>" + -1*((new Date() - aDate)/1000/3600).toFixed(2) + "</strong>" + " Hours Remaining <img src='img/up_arrow.png' class='up_button' alt='Increase Priority' title='Increase priority by 3 hours.'>";
                            tbl_row += "<img src='img/down_arrow.png' class='down_button' alt='Decrease Priority' title='Decrease priority by 3 hours.'></div></td>";

                            tbl_row += "<td><div class='priority_buttons'><img src='img/edit.png' class='edit_button' alt='Edit Task' title='Edit task details.'>";
                            tbl_row+= "<div class='edit_dialog' title='Task #" + count + " Info' style='display: none' id='edit_dialog" + count +"'></div>";

                            tbl_row += "<img src='img/close.png' class='delete_button' alt='Delete Task' title='Delete the task.'></div></td>";

                            tbl_body+= "<tr>" + tbl_row + "</tr>";
                            count++;
                        });
                //console.log(tbl_body);
                $('#taskQueueBody').html(tbl_body);
                /**
                $('#taskQueue').find('tr:gt(0)').remove();
                renderList();
                 **/
            }
            else{
                $('#checksuccess').text("Failed to Submit!");
                $('#checksuccess').css('visibility', 'visible');
                $('#checksuccess').css('color', 'red');
            }
		});
	});
});
