$(document).ready(function () {
	$("#myModal").modal({backdrop: "static"});
	$(".btnclear").click(function(){
        $( ".alerticon" ).remove();
    });
    $('#btforgotPass').on('click', function () {
        var vUserName = $("#yourUsername").val();
        if(vUserName == "")
        {
        
			msg = "Please enter UserName.";
            $("#myModal").modal("show");
            $(".customtext").text(msg);
			$( ".texticon" ).append( '<i class="alerticon bi bi-shield-fill-exclamation text-warning"></i>' );
            $("#yourUsername").focus();
        }        
        else
        {    
            $.ajax({
                type: "Get",
                url: "http://14.142.106.205:8889/Niue/"+vUserName+"/forgotPassword",
				// url: "http://localhost:8889/Niue/"+vUserName+"/forgotPassword",
                data: {},
                async: false,
                success: function (response) {         
                    if (response != null && response != '') {
                       console.log(response);
			
					   msg = response;
					   $("#myModal").modal("show");
					   $(".customtext").text(msg);
					   $( ".texticon" ).append( '<i class="alerticon bi bi-shield-check text-success"></i>' );
                    }
                    else {
                        alert(" Not Found ");
                        return false;
                    }
                },
                error: function (xhr, status, error) {
                  
					msg = "Username is invalid...Please enter valid Username";
           			 $("#myModal").modal("show");
          			  $(".customtext").text(msg);
						$( ".texticon" ).append( '<i class="alerticon bi bi-shield-fill-exclamation text-danger"></i>' );
                },
                failure: function (xhr, status, failure) {
                    alert(failure);
					var pageURL = '/publicusers/loginpage.html';
				   try{						  
					   window.location.href = pageURL;
					   return false;						   
					}
					catch(err){
						alert(err);
					}
                    return false;
                }
            });

        }

    });
	
	
	$('#logoutbutton').on('click', function () {		
        var vUserName = localStorage.getItem('Username');            
		$.ajax({
			type: "Get",
			url: "http://14.142.106.205:8889/Niue/logout",
			//url: "http://localhost:8889/Niue/logout",
			data: {userName:vUserName},
			async: false,
			success: function (response) {         
				if (response != null && response != '') {
				   console.log(response);
				  
				   var pageURL = '/publicusers/loginpage.html';
				   try{		
					   localStorage.removeItem('Username');
					   localStorage.removeItem('Role');
					   localStorage.removeItem('Department');
					   window.location.href = pageURL;
					   return false;						   
					}
					catch(err){
						alert(err);
					}
				}
				else {
					alert(" Not Found ");
					return false;
				}
			},
			error: function (xhr, status, error) {
				alert("Unable to logout");
				var pageURL = '/publicusers/loginpage.html';
			   try{						  
				   window.location.href = pageURL;
				   return false;						   
				}
				catch(err){
					alert(err);
				}
				return false;
			},
			failure: function (xhr, status, failure) {
				alert(failure);
				var pageURL = '/publicusers/loginpage.html';
			   try{						  
				   window.location.href = pageURL;
				   return false;						   
				}
				catch(err){
					alert(err);
				}
				return false;
			}
		});

    });
});
function closeAfterRedirect(){	
    window.location.href = '/publicusers/loginpage.html';
}
function gotoTermsConditions() {
	window.open("/publicusers/termsconditions.html", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=100,left=500,width=800,height=800");
  }
function closeTermsConditions() {
	window.close();
  }