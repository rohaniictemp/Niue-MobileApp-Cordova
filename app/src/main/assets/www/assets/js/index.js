var userRole;

$(document).ready(function () {
    $("#myModal").modal({backdrop: "static"});
    $(".btnclear").click(function(){
        $( ".alerticon" ).remove();
    });
    $('#btnLogin').on('click', function () {         
        var vUserName = $("#yourUsername").val();
        var vPassword = $("#yourPassword").val();
        if (vUserName == "" && vPassword == "") {
            msg = "Please enter UserName and Password.";
            $("#myModal").modal("show");
            $(".customtext").text(msg);  
            $( ".texticon" ).append( '<i class="alerticon bi bi-shield-lock-fill text-warning"></i>' );
            $("#yourUsername").focus();
        }
        else if (vUserName == "") {
            msg = "Please enter UserName.";
            $("#myModal").modal("show");
            $(".customtext").text(msg);
            $( ".texticon" ).append( '<i class="alerticon bi bi-shield-fill-exclamation text-warning"></i>' );
            $("#yourUsername").focus();
        }
        else if (vPassword == "") {       
            msg = "Please enter Password.";
            $("#myModal").modal("show");
            $(".customtext").text(msg);
            $( ".texticon" ).append( '<i class="alerticon bi bi-shield-fill-exclamation text-warning"></i>' );
            $("#yourPassword").focus();
        }
        else
        {    
			var datasetDownload = localStorage.getItem('Dataset'); 
			var datasetName = localStorage.getItem('DatasetName'); 
			var datasetDispaly = localStorage.getItem('Display'); 
            var datasetTheme = localStorage.getItem('DatasetTheme');
            var datset_filepath = localStorage.getItem('ls_datset_filepath');
            
            var wmsurlval = localStorage.getItem('wmsurl_val'); 
            var fileextval = localStorage.getItem('Dataset_ext');
            var datatypeval = localStorage.getItem('ls_datatypeval');             
            var metadata_title = localStorage.getItem('ls_metadata_title'); 
            
			if(datasetDownload != null && datasetDownload != 'undefined')
            {
            				
				localStorage.removeItem('Dataset');
				localStorage.removeItem('DatasetName');
                localStorage.removeItem('DatasetTheme');
                localStorage.removeItem('ls_datatypeval');                
                localStorage.removeItem('ls_metadata_title');

                localStorage.setItem('Username', vUserName);
                localStorage.setItem('Password',vPassword);
              
                
				$.ajax({
						type: "Get",
						url: "http://14.142.106.205:8889/Niue/download/"+datasetTheme,      
                   // url: "http://localhost:8889/Niue/download/"+datasetTheme,                     
						data: {userName:vUserName,passWord:vPassword},
						async: false,
						success: function (response) {         
							if (response != null && response != '') {
                                var arrRes = response.split("?")                                                           
                                if (arrRes[1] != null && arrRes[1] != '' && arrRes[1] != 'null'){
                                    var arrRoleDeprt = arrRes[1].split("&")
                                    localStorage.setItem('Role',arrRoleDeprt[0]);
                                    localStorage.setItem('Department',arrRoleDeprt[1]);
                                }
                                if (arrRes[0] == 'Success') {
                                    if (datasetDownload == 'Download') {
                                        // DownloadDataset(wmsurlval,datasetName);
                                        if (datatypeval == "Raster") {
                                            DownloadRasterDataset(datasetName, wmsurlval, metadata_title);

                                        }
                                        else if (datatypeval == "Vector") {
                                            DownloadVectorDataset(datasetName, wmsurlval)
                                        }//end of if vector condition
                                        myTimeout = setTimeout(GoToSearchPg,5000);
                                    }
                                    if(datasetDownload == 'download_docs_media')
                                    {
                                        DownloadDocMediaFiles_v2(fileextval, datset_filepath, datasetName);
                                        myTimeout = setTimeout(GoToSearchPg,5000);  
                                    } 						  
                                }
                                else
                                {
                                    msg = vUserName+" does not have permission to download dataset "+datasetName;
                                    $("#myModalDownload").modal("show");
                                    $(".customtext").text(msg);
                                    $( ".texticon" ).append( '<i class="alerticon bi bi-shield-lock-fill text-danger"></i>' );
                                    
                                }                                
							}  
						},
						error: function (xhr, status, error) {
							alert("Unable to download");				
							return false;
						},
						failure: function (xhr, status, failure) {
							alert(failure);				
							return false;
						}
					}); 
             
            } 			
        else {
            $.ajax({
                type: "POST",
                url: "http://14.142.106.205:8889/Niue/login",
                //  url: "http://localhost:8889/Niue/login",
                data: { userName: vUserName, passWord: vPassword },
                async: false,
                success: function (response) {                     
                    if (response != null && response != '') { 
                        console.log(response);                        
                        var arrRes = response.split("?")
                        console.log(arrRes);
                        var pageURL = '/adminusers/AllusersListmode.html';
                        if (arrRes[1] != null && arrRes[1] != '' && arrRes[1] != 'null'){
                            var arrRoleDeprt = arrRes[1].split("&")
                            localStorage.setItem('Role',arrRoleDeprt[0]);
                            localStorage.setItem('Department',arrRoleDeprt[1]);
                        }
                        else{
                            if(arrRes[1] == 'null'){
                                var msg = 'Invalid User Credentials';
                                $("#myModal").modal("show");
                                $(".customtext").text(msg);
                                $( ".texticon" ).append( '<i class="alerticon bi bi-shield-fill-x text-danger"></i>' );
                                $("#yourUsername").val('');
                                $("#yourPassword").val('');
                                return false;
                                console.log("redirecting URL ::  " + window.location.href);
                            }
                        }   

                    localStorage.setItem('Username', vUserName);
                    localStorage.setItem('Password',vPassword);

                    window.location.href = pageURL;
                    return false;
                    console.log("redirecting URL ::  " + window.location.href);
                }
                else {                      
                    msg = " Not Found ";
                    $("#myModal").modal("show");
                    $(".customtext").text(msg);
                    $( ".texticon" ).append( '<i class="alerticon bi bi-shield-fill-x text-danger"></i>' );
                    $("#yourUsername").val('');
                    $("#yourPassword").val('');
                    return false;
                }
            },
                error: function (xhr, status, error) {
                    msg = " Username or Password is invalid...Please enter valid Username and Password ";
                    $("#myModal").modal("show");
                    $(".customtext").text(msg);
                    $( ".texticon" ).append( '<i class="alerticon bi bi-shield-lock-fill text-danger"></i>' );
                    return false;
                },
                failure: function (xhr, status, failure) {
                    $("#myModal").modal("show");
                    $(".customtext").text(failure);
                    $( ".texticon" ).append( '<i class="alerticon bi bi-shield-fill-x text-danger"></i>' );
                    return false;
                }
            });
        }

    }
});

    function DownloadRasterDataset(datasetName, wmsurlval, metadata_title) {

        var dataset_metadataURL = "http://14.142.106.205:8080/geonetwork/srv/eng/q?title=" + metadata_title + "&from=1&to=20&resultType=details&fast=index&_content_type=json";

        $.get(dataset_metadataURL, function (data, status) {
            console.log("json fired");
            var wmsurl_data = "";
            var wmsurl_version2 = "?service=WMS&version=1.1.0&request=GetMap&";
            var layer_name = "layers=" + datasetName + "&";
            var bbox = "bbox=" + data.metadata.geoBox.replaceAll('|', '%2C') + "&";
            var finalvar = "width=768&height=649&srs=EPSG%3A4326&styles=&format=image/geotiff";
            wmsurl_data = wmsurlval + wmsurl_version2 + layer_name + bbox + finalvar;

            var imgurl = wmsurl_data;
            var filename = datasetName;
            var $a = $('<a />', {
                'href': imgurl,
                'download': filename,
                'target': "_blank"
            }).hide().appendTo("body")[0].click();
        });
    }

    function DownloadVectorDataset(datasetName, wmsurlval) {
        var wmsurl = wmsurlval + '?';
        var form = document.createElement("form");
        form.method = "POST";
        form.action = wmsurl;
        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "request";
        input.value = "GetFeature";
        form.appendChild(input);

        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "service";
        input.value = "WFS";
        form.appendChild(input);


        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "version";
        input.value = "1.0.0";
        form.appendChild(input);


        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "outputFormat"
        input.value = "shape-zip";
        form.appendChild(input);


        var input = document.createElement("input");
        input.type = "hidden";
        input.name = "typeName";
        input.value = datasetName;
        form.appendChild(input);

        document.body.appendChild(form);
        form.submit();
    }

function GoToSearchPg()
{
    window.location.href =  '/adminusers/AllusersListmode.html';
}
});//end of ready()

function DownloadDocMediaFiles_v2(fileextval, datset_filepath, filename) {

    //var imgurl = "http://14.142.106.205:8080/hfserver/Health/2702/niuepng2.jpg";  
    var imgurl = datset_filepath;
    var $a = $('<a />', {
        'href': imgurl,
        'download': filename,
        'target': "_blank"
    }).hide().appendTo("body")[0].click();
}

function closeAfterRedirect(){	
    window.location.href = '/adminusers/AllusersListmode.html'; 
}