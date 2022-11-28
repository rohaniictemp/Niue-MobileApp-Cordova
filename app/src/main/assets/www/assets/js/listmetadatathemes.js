$(document).ready(function () { 

    $("#myModal").modal({backdrop: "static"});  
    $("#myModal_loginredirect").modal({backdrop: "static"});  
    
    $(".btnclear").click(function(){
        $( ".alerticon" ).remove();
    });

    //list/Grid view btn clicks events
    var gridbtn_Flag = true;
    $("#listviewofpod").click(function () {
        gridbtn_Flag = true;
        $(".listandgridview").removeClass("col-md-6");
        $(".listandgridview").addClass("col-md-12");
        $(".flexclass").addClass("flex-row");
        $(".flexclass").removeClass("flex-row-reverse");
    });

    $("#gridviewofpod").click(function () {
        gridbtn_Flag = false;
        $(".listandgridview").removeClass("col-md-12");
        $(".listandgridview").addClass("col-md-6");
        $(".flexclass").addClass("flex-row-reverse");
        $(".flexclass").removeClass("flex-row");
    }); 


    /* function getthemesArr(deptnme)
    {
     var deptCode;
     var themesArr=[];
     themenameArr = [];
 
     for(i=0;i<mappingdata.Departments.length;i++)
     {
         if(mappingdata.Departments[i].Departmentname.toLowerCase() === deptnme.toLowerCase())
         {
             deptCode=mappingdata.Departments[i].Departmentcode;
         }
     } 
 
     for(j=0;j<mappingdata.Mappings.length;j++)
     {
         if(mappingdata.Mappings[j].Code.toLowerCase() == deptCode.toLowerCase())
         {
             themesArr=mappingdata.Mappings[j].Relation;
         }
     }
 
     for(k=0;k<mappingdata.Themes.length;k++)
     {
         var themeCode = mappingdata.Themes[k].Themecode;
 
         if(themesArr.indexOf(themeCode)!=-1)
         {
             var themename=mappingdata.Themes[k].Themename;
             themenameArr.push(themename);
             
         }
         
     }
    
     console.log(themenameArr);
     //console.log(themesArr);   
 } */

 function DisplayDep_ThemesArr(deptnme)
 {     
    //var mappingjson_URL = "http://14.142.106.205:8080/hfserver/mappings.json";
    var mappingjson_URL = "../assets/js/mappings.json"; 
    var themenameArr = [];
    $.ajax({
        type: "Get", 
        url: mappingjson_URL,       
        data: {},
        async: false,              
        success : function(mappingdata){                
          	console.log(mappingdata);
              var deptCode;
              var themesArr=[];
          
              for(i=0;i<mappingdata.Departments.length;i++)
              {
                  if(mappingdata.Departments[i].Departmentname.toLowerCase() === deptnme.toLowerCase())
                  {
                      deptCode=mappingdata.Departments[i].Departmentcode;
                  }
              } 
          
              for(j=0;j<mappingdata.Mappings.length;j++)
              {
                  if(mappingdata.Mappings[j].Code.toLowerCase() == deptCode.toLowerCase())
                  {
                      themesArr=mappingdata.Mappings[j].Relation;
                  }
              }
          
              for(k=0;k<mappingdata.Themes.length;k++)
              {
                  var themeCode = mappingdata.Themes[k].Themecode;
          
                  if(themesArr.indexOf(themeCode)!=-1)
                  {
                      var themename=mappingdata.Themes[k].Themename;
                      themenameArr.push(themename);
                      
                  }
                  
              }
             
              console.log(themenameArr);
             
        },//end of success
        error: function (e) {
            console.log("ERROR : ", e);
            msg = e.responseText;            
        }
      });
      return  themenameArr;		
 }
 
    //search datasets
    $('#imgrecordsearch').on('click', function () {

        var boolFnd = false;
        $(".datatypecls:checkbox:checked").each(function () {
            if ($(this).is(':checked')) {
                boolFnd = true;
            }
        });
        if (boolFnd == false) {
            $(this)[0].checked = false;
            msg = "Please select Type of Resources (Vector/Raster/Documents/Media)";
            $("#myModal").modal("show");
            $(".customtext").text(msg);
            $(".texticon").append('<i class="alerticon bi bi-shield-fill-exclamation text-warning"></i>');
            return;
        }

        var chks = document.getElementsByClassName('themesnav_cls');
        var l = chks.length;
        while (l--) {
            if (!chks[l].disabled)
                chks[l].checked = false;
        }

        $('#baseclassDiv').empty();

        var textval = $('#myInput').val();
        if (textval == '') {
            $('#baseclassDiv').empty();
            return;
        }

        //search documents/medis datasets
        TxtSearchDocsMediafn(textval);
         
        //search vector/raster datasets
        $.get("http://14.142.106.205:8080/geonetwork/srv/eng/q?&resultType=details&fast=index&_content_type=json",
            function (data, status) {

                var metadataArr = data['metadata'];
                $.each(metadataArr, function (index, metadatarec) {

                    var datatypeval = metadatarec['spatialRepresentationType_text'];
                    var datatype_img = "../assets/img/leftpaneicons/sidebarimg-16.png";
                    if (datatypeval == "Vector") {
                        datatype_img = "../assets/img/leftpaneicons/sidebarimg-16.png";
                    }
                    else {
                        datatype_img = "../assets/img/leftpaneicons/sidebarimg-15.png";
                    }

                    /////////for testing purpose only 
                    var dataset_deptName;
                    if (metadatarec['keywordGroup'].otherKeywords[1] != undefined) {
                        dataset_deptName = metadatarec['keywordGroup'].otherKeywords[1].value;
                    } 
                    //for logged in user
                    var deptnme2 = localStorage.getItem('Department');
                    if (deptnme2 != null || deptnme2 != undefined) {

                    //if the dataset does not match with logged in user break
                    if(deptnme2 !=dataset_deptName )
                        {
                           // break;
                            return;
                              
                        }
                    }
                    //When department icon in the home page is clicked                     
                     if (deptnme != null || deptnme != undefined) {
                        if(deptnme !=dataset_deptName )
                        {
                            //break;
                            return;
                        }
                    }                            
                ///////////////////////// 
                
                    var metadata_title = metadatarec.title;
                    var searres = metadata_title.toLowerCase().search(textval.toLowerCase());
                    var metadata_Theme = metadatarec['keywordGroup'].otherKeywords[0].value

                    if (searres > -1) {
                        var data = "";
                        var metadata_title = metadatarec['title']
                        var metadata_abstract = metadatarec['abstract'];
                        var uuid = metadatarec['geonet:info'].uuid;
                        var metadata_link = metadatarec['link'].split('|');
                        var wmnname = metadata_link[0];
                        var wmsurl = metadata_link[2];
                        var imageArr = metadatarec.image.split("|")
                        var imageval = imageArr[1];
                        var topicCat = metadatarec['topicCat'];
                        var status = metadatarec['status'];
                        var updateFrequency = metadatarec['updateFrequency'];
                        var datatype_val = metadatarec['spatialRepresentationType_text']
                        var crsval = metadatarec['crs'];

                        if (gridbtn_Flag == true) {
                            data += '<div class="col-md-12 listandgridview">';
                        }
                        else {
                            data += '<div class="col-md-6 listandgridview">';
                        }
                        data += '<div class="card pb-0 ">'

                        //Header
                        data += '<div class="card-header" style="background-color: #0d6efd80;"><h5 class="card-title my-0 py-0"><i><img src= "' + datatype_img + '" class="me-2" style="width:35px; height:35px;"/></i>' + metadata_title + ''
                        data += '</h5></div>'

                        //body section
                        data += '<div class="card-body px-3">'
                        data += '<div class="row">'
                        data += '<div class="col-12 col-sm-3 col-md-2"><img src= "' + imageval + '" class="border p-1 rounded dataset_img"/></div>'

                        data += '<div class="col-12 col-sm-6 col-md-8 card-text">'
                        data += '<div class="d-flex flex-wrap h-100 w-100">'
                        data += '<div class="w-100">'
                        data += metadata_abstract
                        data += '</div>'
                        data += '<a class="w-100 text-end align-content-end" href="../adminusers/continueReading.html" onclick="DisplayMetadata_SpatialDatasets(\'' + wmsurl + '\',\'' + wmnname + '\',\'' + metadata_title + '\')">Continue Reading..</a></div>'
                        data += '</div>'
                        data += '<div class="col-12 col-sm-3 col-md-2"><div class="d-flex flex-wrap align-content-center justify-content-center h-100"><a href=#" title="Download" onclick="DownloadDataset(\'' + metadata_Theme + '\',\'' + wmsurl + '\',\'' + wmnname + '\')" class="btn btn-primary text-center align-content-center" style="font-size: 24px;"><i class="bi bi-download"></i></a></div></div>'
                        data += '</div>'
                        data += '</div>'

                        data += '</div>'
                        data += '</div>'

                        $('#baseclassDiv').append(data);
                        document.getElementById(metadata_Theme).checked = true;
                    }//end of if loop 
                });//end of each
            });//end of get query	 
    });//end of img search   

    //search documents/medis datasets
    function TxtSearchDocsMediafn(textval) {
        $.get("http://14.142.106.205:8889/Niue/getAllMetadata",
        //$.get("http://localhost:8889/Niue/getAllMetadata",
            function (data, status) {
                // console.log("Data: " + data + "\nStatus: " + status);
                $.each(data, function (index, pdfmetadatarec) {

                    var datatype_img = "../assets/img/leftpaneicons/documents.png";
                    var imageval = "../assets/img/docs_media_icons/pdf.png";
                    if (pdfmetadatarec.fileName == null) {
                        return true;
                    }
                    var metadata_title = pdfmetadatarec.fileName;
                    var fileext = pdfmetadatarec.fileName.split('.')[1];
                    var datset_filepath = pdfmetadatarec.filePath
                    var dataset_deptName = pdfmetadatarec.deptName;
                    var dataset_description = pdfmetadatarec.description;

                    var dataset_themeName = pdfmetadatarec.themeName;
                    var dataset_villegeName = pdfmetadatarec.villageName;

                    var dataset_uploadedBy = pdfmetadatarec.uploadedBy;
                    var dataset_uploadedDate = pdfmetadatarec.uploadedDate;

                    var dataset_updatedby = pdfmetadatarec.uploadedBy;
                    var dataset_updateddate = pdfmetadatarec.uploadedDate;

                    /////////for testing purpose only 
                    //for logged in user
                    var deptnme2 = localStorage.getItem('Department');
                    if (deptnme2 != null || deptnme2 != undefined) {

                    //if the dataset does not match with logged in user break
                    if(deptnme2 !=dataset_deptName )
                        {
                           // break;
                            return;
                              
                        }
                    }
                    //When department icon in the home page is clicked                     
                     if (deptnme != null || deptnme != undefined) {
                        if(deptnme !=dataset_deptName )
                        {
                            //break;
                            return;
                        }
                    }                            
                /////////////////////////

                    var searres = metadata_title.toLowerCase().includes(textval.toLowerCase());
                    if (searres == true) {
                        var datatypeArr = [];
                        $(".datatypecls:checkbox:checked").each(function () {
                            datatypeArr.push($(this).val());
                        });
                        var datatypeFoundval = datatypeArr.includes("Documents");
                        if (datatypeFoundval == true) {

                            if (fileext == 'pdf' || fileext == 'docx' || fileext == 'doc' || fileext == 'xls') {

                                var datatype_img = "../assets/img/leftpaneicons/documents.png";
                                var imageval = "../assets/img/docs_media_icons/pdf.png";
                                if (fileext == 'pdf') {
                                    imageval = "../assets/img/docs_media_icons/pdf.png";
                                }
                                if (fileext == 'docx') {
                                    imageval = "../assets/img/docs_media_icons/doc.png";
                                }
                                if (fileext == 'doc') {
                                    imageval = "../assets/img/docs_media_icons/doc.png";
                                }
                                if (fileext == 'xls') {
                                    imageval = "../assets/img/docs_media_icons/xls.png";
                                }

                                if (dataset_themeName != null && dataset_themeName !== undefined) {
                                    DocsMediaDataPanel(datatype_img, metadata_title, imageval, dataset_description, fileext, dataset_deptName, dataset_themeName,dataset_villegeName, datset_filepath, dataset_uploadedBy, dataset_uploadedDate, dataset_updatedby, dataset_updateddate);
                                    if (document.getElementById(dataset_themeName) != null) {
                                        document.getElementById(dataset_themeName).checked = true;
                                    }
                                }
                            }//end of if fileext check condition 
                        }//end of datatype condition 
                        var datatypeFoundval = datatypeArr.includes("Mediafiles");
                        if (datatypeFoundval == true) {

                            if (fileext == 'mp4' || fileext == 'png' || fileext == 'jpg' || fileext == 'jpeg') {
                                var datatype_img = "../assets/img/leftpaneicons/mediafiles.png";
                                var imageval = "../assets/img/docs_media_icons/image.png";
                                if (fileext == 'png' || fileext == 'jpg' || fileext == 'jpeg') {
                                    imageval = "../assets/img/docs_media_icons/image.png";
                                }
                                else if (fileext == 'mp4') {
                                    imageval = "../assets/img/docs_media_icons/video.png";
                                }

                                if (dataset_themeName != null && dataset_themeName !== undefined) {
                                    DocsMediaDataPanel(datatype_img, metadata_title, imageval, dataset_description, fileext, dataset_deptName, dataset_themeName,dataset_villegeName, datset_filepath, dataset_uploadedBy, dataset_uploadedDate, dataset_updatedby, dataset_updateddate);
                                    if (document.getElementById(dataset_themeName) != null) {
                                        document.getElementById(dataset_themeName).checked = true;
                                    }
                                }

                            }//end of if fileext check condition 
                        }//end of datatype condition 
                    }//end of if search condition()
                });//end of each record parsing
            });//end of ajax
    }

    //when search btn is clicked without giving any input
    $("#myInput").on("keypress", function (e) {
        if (e.keyCode === 13 || e.which === 13) {
            e.preventDefault();
            return false;
        }
    });

    //when type of resource option is checked
    $('.datatypecls').click(function () {

        var documents_val = $(this).val();
        var restype_val = $(this).val();
        if ($(this).is(':checked')) {

        }
        else {

            if (restype_val == "Documents") {

                $('#baseclassDiv').empty();
            }

            if (restype_val == "Mediafiles") {

                $('#baseclassDiv').empty();
            }

            if (restype_val == "Vector") {

                $('#baseclassDiv').empty();
            }
        }
        InitializeDatasets();
        Load_DocMedia_data();
    });

    //load documents/media datasets for selected themes
    function Load_DocMedia_data() {  

        var datatypeArr = [];
        $(".datatypecls:checkbox:checked").each(function () {
            datatypeArr.push($(this).val());
        }); 

        var selectedMetaVal = [];
        $("input:checkbox[class=themesnav_cls]:checked").each(function () {
            selectedMetaVal.push($(this).val());
        });

        var villegelistArr = []; 
        $("input:checkbox[class=villagelist_cls]:checked").each(function () {
            villegelistArr.push($(this).val());
        }); 

        $('#baseclassDiv').empty();

         $.get("http://14.142.106.205:8889/Niue/getAllMetadata",
      //  $.get("http://localhost:8889/Niue/getAllMetadata",
            function (data, status) {
                //console.log("Data: " + data + "\nStatus: " + status);
                $.each(data, function (index, pdfmetadatarec) { 

                    var datatype_img = "../assets/img/leftpaneicons/documents.png";
                    var imageval = "../assets/img/docs_media_icons/pdf.png";
                    if(pdfmetadatarec.fileName==null)
                    { 
                        return true;
                    }

                    var metadata_title = pdfmetadatarec.fileName;
                    var fileext = pdfmetadatarec.fileName.split('.')[1];
                    var dataset_deptName = pdfmetadatarec.deptName;
                    var dataset_description = pdfmetadatarec.description;

                    var dataset_themeName = pdfmetadatarec.themeName;
                    var datset_filepath = pdfmetadatarec.filePath

                    var dataset_villegeName = pdfmetadatarec.villageName;
                    var dataset_uploadedBy = pdfmetadatarec.uploadedBy;
                    var dataset_uploadedDate = pdfmetadatarec.uploadedDate;

                    var dataset_updatedby = pdfmetadatarec.updatedBy;
                    var dataset_updateddate = pdfmetadatarec.updatedDate;

                    var villegelistArr_Foundval = villegelistArr.includes(dataset_villegeName); 
                    
                     /////////for testing purpose only 
                    //for logged in user
                    var deptnme2 = localStorage.getItem('Department');
                    if (deptnme2 != null || deptnme2 != undefined) {

                    //if the dataset does not match with logged in user break
                    if(deptnme2 !=dataset_deptName )
                        {
                           // break;
                            return;
                              
                        }
                    }
                    //When department icon in the home page is clicked                     
                     if (deptnme != null || deptnme != undefined) {
                        if(deptnme !=dataset_deptName )
                        {
                            //break;
                            return;
                        }
                    }                            
                /////////////////////////


                    var datatypeFoundval = datatypeArr.includes("Documents");
                    if (datatypeFoundval == true) {
                        for (i = 0; i < selectedMetaVal.length; i++) {
                            if (selectedMetaVal[i] == dataset_themeName) {
                                //var dept_name = localStorage.getItem('deptname'); 
                                /* /////////for testing purpose only 

                                   var deptnme2 = localStorage.getItem('Department');
                                    if (deptnme2 != null || deptnme2 != undefined) {

                                    if(deptnme2 !=dataset_deptName )
                                        {
                                            break;
                                        }
                                    }

                                    //var deptnme = localStorage.getItem('deptname');   
                                    if (deptnme != null || deptnme != undefined) {
                                        if(deptnme !=dataset_deptName )
                                        {
                                            break;
                                        }
                                    }                               
                                ///////////////////////// */
                                
                                if(deptnme == "Community Affairs")
                                {
                                if (villegelistArr_Foundval == true) { 

                                    if (fileext == 'pdf' || fileext == 'docx' || fileext == 'doc' || fileext == 'xls') {
                                        var datatype_img = "../assets/img/leftpaneicons/documents.png";
                                        var imageval = "../assets/img/docs_media_icons/pdf.png";
                                        if (fileext == 'pdf') {
                                            imageval = "../assets/img/docs_media_icons/pdf.png";
                                        }
                                        if (fileext == 'docx') {
                                            imageval = "../assets/img/docs_media_icons/doc.png";
                                        }
                                        if (fileext == 'doc') {
                                            imageval = "../assets/img/docs_media_icons/doc.png";
                                        }
                                        if (fileext == 'xls') {
                                            imageval = "../assets/img/docs_media_icons/xls.png";
                                        }
                                        DocsMediaDataPanel(datatype_img, metadata_title, imageval, dataset_description, fileext, dataset_deptName, dataset_themeName,dataset_villegeName, datset_filepath, dataset_uploadedBy, dataset_uploadedDate, dataset_updatedby, dataset_updateddate);
                                    }//end of if fileext check condition
                                }//end of villagelist found condition 
                            }//end of dept check
                            else
                            { 
                                if (fileext == 'pdf' || fileext == 'docx' || fileext == 'doc' || fileext == 'xls') {
                                    var datatype_img = "../assets/img/leftpaneicons/documents.png";
                                    var imageval = "../assets/img/docs_media_icons/pdf.png";
                                    if (fileext == 'pdf') {
                                        imageval = "../assets/img/docs_media_icons/pdf.png";
                                    }
                                    if (fileext == 'docx') {
                                        imageval = "../assets/img/docs_media_icons/doc.png";
                                    }
                                    if (fileext == 'doc') {
                                        imageval = "../assets/img/docs_media_icons/doc.png";
                                    }
                                    if (fileext == 'xls') {
                                        imageval = "../assets/img/docs_media_icons/xls.png";
                                    }
                                    DocsMediaDataPanel(datatype_img, metadata_title, imageval, dataset_description, fileext, dataset_deptName, dataset_themeName,dataset_villegeName, datset_filepath, dataset_uploadedBy, dataset_uploadedDate, dataset_updatedby, dataset_updateddate);
                                }//end of if fileext check condition
                           // }
                       // }
                    }
                            }                  
                        }//end of for loop
                    }//end of datatype condition
                    datatypeFoundval = datatypeArr.includes("Mediafiles");
                    if (datatypeFoundval == true) {
                        for (i = 0; i < selectedMetaVal.length; i++) {
                            if (selectedMetaVal[i] == dataset_themeName) {
                                if(deptnme == "Community Affairs")
                                {
                                if (villegelistArr_Foundval == true) { 

                                    if (fileext == 'mp4' || fileext == 'png' || fileext == 'jpg' || fileext == 'jpeg') {
                                        var datatype_img = "../assets/img/leftpaneicons/mediafiles.png";
                                        var imageval = "../assets/img/docs_media_icons/image.png";
                                        if (fileext == 'png' || fileext == 'jpg' || fileext == 'jpeg') {
                                            ;
                                            imageval = "../assets/img/docs_media_icons/image.png";
                                        }
                                        else if (fileext == 'mp4') {
                                            imageval = "../assets/img/docs_media_icons/video.png";
                                        }
                                        DocsMediaDataPanel(datatype_img, metadata_title, imageval, dataset_description, fileext, dataset_deptName, dataset_themeName,dataset_villegeName, datset_filepath, dataset_uploadedBy, dataset_uploadedDate, dataset_updatedby, dataset_updateddate);
                                    }//end of if fileext check condition
                                }//end of villagelist found condition 
                            }//end of dept check
                            else{
                               
                                if (fileext == 'mp4' || fileext == 'png' || fileext == 'jpg' || fileext == 'jpeg') {
                                    var datatype_img = "../assets/img/leftpaneicons/mediafiles.png";
                                    var imageval = "../assets/img/docs_media_icons/image.png";
                                    if (fileext == 'png' || fileext == 'jpg' || fileext == 'jpeg') {
                                        ;
                                        imageval = "../assets/img/docs_media_icons/image.png";
                                    }
                                    else if (fileext == 'mp4') {
                                        imageval = "../assets/img/docs_media_icons/video.png";
                                    }
                                    DocsMediaDataPanel(datatype_img, metadata_title, imageval, dataset_description, fileext, dataset_deptName, dataset_themeName,dataset_villegeName, datset_filepath, dataset_uploadedBy, dataset_uploadedDate, dataset_updatedby, dataset_updateddate);
                                } //end of if fileext condition
                            }
                            }
                        }//end of for
                    }//end of datatype check condition
                    var metadata_abstract = pdfmetadatarec.description;
                });//end of foreach() 
            });//end of get() 
    }
   
    //Display documents/media information in the panel
    function DocsMediaDataPanel(datatype_img, metadata_title, imageval, dataset_description, fileext, dataset_deptName, dataset_themeName,dataset_villegeName, datset_filepath, dataset_uploadedBy, dataset_uploadedDate, dataset_updatedby, dataset_updateddate) {
        var data = "";

        if (gridbtn_Flag == true) {
            data += '<div class="col-md-12 listandgridview">';
        }
        else {
            data += '<div class="col-md-6 listandgridview">';
        }
        data += '<div class="card pb-0">'

        //Header        
        data += '<div class="card-header" style="background-color: #0d6efd80;"><h5 class="card-title my-0 py-0"><i><img src= "' + datatype_img + '" class="me-2" style="width:35px; height:35px;"/></i>' + metadata_title + ''
        data += '</h5></div>'

        //body section
        data += '<div class="card-body px-3">'
        data += '<div class="d-flex flex-row align-items center flexclass">'
        data += '<div class="col-12 col-sm-3 col-md-2 col-lg-2"><img src= "' + imageval + '" class="border p-1 rounded dataset_img"/></div>'

        data += '<div class="col-12 col-sm-5 col-md-6 col-lg-6 card-text">'
        data += '<div class="d-flex flex-wrap h-100 w-100 ps-3">'
        data += '<div class="w-100">'
        data += dataset_description
        data += '</div>'
        data += '<a class="w-100 text-end align-content-end" href="../adminusers/document_mediainfo.html" onclick="Displaymetadatadocs(\'' + metadata_title + '\',\'' + dataset_deptName + '\',\'' + dataset_description + '\',\'' + dataset_themeName + '\',\'' + dataset_villegeName + '\',\'' + dataset_uploadedBy + '\',\'' + dataset_uploadedDate + '\',\'' + dataset_updatedby + '\',\'' + dataset_updateddate + '\')" >Continue Reading..</a></div>'
        data += '</div>'
        data += '<div class="col-12 col-sm-4 col-md-4 col-lg-4">'
        data += '<div class="d-flex flex-wrap align-content-center justify-content-center h-100">'
        data += '<a href=#" title="Download" onclick="ViewDocMediaFiles(\'' + metadata_title + '\',\'' + datset_filepath + '\',\'' + fileext + '\')" class="btn btn-primary text-center align-content-center me-3" style="font-size: 24px;"><i class="bi bi-eye"></i></a>'
        data += '<a href=#" title="Download" onclick="DownloadDocMediaFiles(\'' + dataset_themeName + '\',\'' + datset_filepath + '\',\'' + fileext + '\',\'' + metadata_title + '\')" class="btn btn-primary text-center align-content-center" style="font-size: 24px;"><i class="bi bi-download"></i></a>'
        data += '</div>'
        data += '</div>'
        data += '</div>'

        data += '</div>'
        data += '</div>'

        $('#baseclassDiv').append(data);
    }

    //when themes are clicked
    $('.themesnav_cls').click(function () {

        var boolFnd = false;
        $(".datatypecls:checkbox:checked").each(function () {
            if ($(this).is(':checked')) {
                boolFnd = true;
            }
        });
        if (boolFnd == false) {
            $(this)[0].checked = false;
            msg = "Please select Type of Resources (Vector/Raster/Documents/Media)";
            $("#myModal").modal("show");
            $(".customtext").text(msg);
            $(".texticon").append('<i class="alerticon bi bi-shield-fill-exclamation text-warning"></i>');
            return;
        }
        //display vector/raster datasets in the panel for the selected themes
        InitializeDatasets();

        //display documents/media datasets in the panel for the selected themes
        Load_DocMedia_data();
    });  


    //when themes are clicked
    $('.villagelist_cls').click(function () {

        var boolFnd = false;
        $(".datatypecls:checkbox:checked").each(function () {
            if ($(this).is(':checked')) {
                boolFnd = true;
            }
        });
        if (boolFnd == false) {
            $(this)[0].checked = false;
            msg = "Please select Type of Resources (Vector/Raster/Documents/Media)";
            $("#myModal").modal("show");
            $(".customtext").text(msg);
            $(".texticon").append('<i class="alerticon bi bi-shield-fill-exclamation text-warning"></i>');
            return;
        }
        //display vector/raster datasets in the panel for the selected themes
        InitializeDatasets();

        //display documents/media datasets in the panel for the selected themes
        Load_DocMedia_data();
    });  

    function mergeTwoArrays(_arrayA, _arrayB) {
        if (!_arrayB.push || !_arrayB.length)
            // if _arrayB is not an array, or empty, then return _arrayA
            return _arrayA;
        // if _arrayA is empty, return _arrayB
        if (!_arrayA.length)
            return _arrayB.concat();
        // iterate through all the elements of _arrayB
        for (var i = 0; i < _arrayB.length; i++) {
            // if _arrayB's element is not present in _arrayA only then add them to _arrayA
            if (_arrayA.indexOf(_arrayB[i]) == -1)
                _arrayA.push(_arrayB[i]);
        }
        return _arrayA;
    }

    //Departments login themes checking
    function FinilizeCheckList(gl_chklistArr) {
        //console.log(gl_chklistArr);
        $("input:checkbox[class=themesnav_cls]").each(function () {
            if (gl_chklistArr.includes($(this).val())) {
                $(this)[0].checked = true;

            }
            else {
                $(this)[0].checked = false; 
            }
        });
    }
    
   //During login
    var themenameArr = [];
    var deptnme2 = localStorage.getItem('Department');
    if (deptnme2 != null || deptnme2 != undefined) { 

        if (deptnme2 == "Community Affairs") {
            document.getElementById("villegeListId").style.display = "block";
        }
        else {
            document.getElementById("villegeListId").style.display = "none";
        }

       
        if (deptnme2 == "Guest") {
            themenameArr = ['GeologyandSoils', 'Functional Areas', 'Land Parcels', 'Transport Networks', 'Elevation and depth']
        }
        else {
            // getthemesArr(deptnme2);
            themenameArr = DisplayDep_ThemesArr(deptnme2);
        } 
        console.log(themenameArr);
        FinilizeCheckList(themenameArr);    
        themenameArr = [];    
    }
   
    //When department icon in the home page is clicked
    var deptnme = localStorage.getItem('deptname');
    if (deptnme != null || deptnme != undefined) {
        // console.log(mappingdata);
        if (deptnme == "Community Affairs") {
            document.getElementById("villegeListId").style.display = "block";
        }
        else {
            document.getElementById("villegeListId").style.display = "none";
        }
        //getthemesArr(deptnme);
        themenameArr = DisplayDep_ThemesArr(deptnme);
        //console.log(themenameArr);
        FinilizeCheckList(themenameArr);
        themenameArr = [];
        localStorage.removeItem('deptname');
    } 

    //display vector/raster datasets in the panel for the selected themes
    InitializeDatasets();

    //display vector/raster datasets in the panel for the selected themes
    function InitializeDatasets() {

         var datatypeArr = [];
        $(".datatypecls:checkbox:checked").each(function () {
            datatypeArr.push($(this).val());
        });

        var selectedMetaVal = []; 
        $("input:checkbox[class=themesnav_cls]:checked").each(function () {
            selectedMetaVal.push($(this).val());
        });
        $('#baseclassDiv').empty(); 

        $.get("http://14.142.106.205:8080/geonetwork/srv/eng/q?resultType=details&fast=index&_content_type=json",
            function (data, status) {                         
                // alert("Data: " + data + "\nStatus: " + status);
                var metadataArr = data['metadata'];
                $.each(metadataArr, function (index, metadatarec) {

                    var datatypeval = metadatarec['spatialRepresentationType_text'];                   
                  
                    var datatype_img = "../assets/img/leftpaneicons/sidebarimg-16.png";
                    if (datatypeval == "Vector") {
                        datatype_img = "../assets/img/leftpaneicons/sidebarimg-16.png";
                    }
                    else {
                        datatype_img = "../assets/img/leftpaneicons/sidebarimg-15.png";
                    }

                     /////////for testing purpose only 
                     var dataset_deptName;
                    if (metadatarec['keywordGroup'].otherKeywords[1] != undefined) {
                        dataset_deptName = metadatarec['keywordGroup'].otherKeywords[1].value;
                    } 
                    //for logged in user
                    var deptnme2 = localStorage.getItem('Department');
                    if (deptnme2 != null || deptnme2 != undefined) {

                    //if the dataset does not match with logged in user break
                    if(deptnme2 !=dataset_deptName )
                        {
                           // break;
                            return;
                              
                        }
                    }
                    //When department icon in the home page is clicked                     
                     if (deptnme != null || deptnme != undefined) {
                        if(deptnme !=dataset_deptName )
                        {
                            //break;
                            return;
                        }
                    }                            
                ///////////////////////// 

                    if (datatypeval == '' || datatypeval == undefined) {
                        datatypeval = 'Raster';
                    }
                    var datatypeFoundval = datatypeArr.includes(datatypeval);
                    if (datatypeFoundval == true) {

                        var metadata_Theme = metadatarec['keywordGroup'].otherKeywords[0].value
                        for (i = 0; i < selectedMetaVal.length; i++) {
                            if (selectedMetaVal[i] == metadata_Theme) {

                                var data = "";
                                var metadata_title = metadatarec['title']
                                var metadata_abstract = metadatarec['abstract'];
                                var uuid = metadatarec['geonet:info'].uuid;
                                var metadata_link = metadatarec['link'].split('|');
                                var wmnname = metadata_link[0];
                                var wmsurl = metadata_link[2];
                                //var imageval = metadatarec.image;
                                var imageArr = metadatarec.image.split("|")
                                var imageval = imageArr[1].replace('localhost', '14.142.106.205');
                                //var imageval = imageArr[1];
                                var topicCat = metadatarec['topicCat'];
                                var status = metadatarec['status'];

                                var updateFrequency = metadatarec['updateFrequency'];
                                var datatype_val = metadatarec['spatialRepresentationType_text']
                                var crsval = metadatarec['crs'];

                                if (gridbtn_Flag == true) {
                                    data += '<div class="col-md-12 listandgridview">';
                                }
                                else {
                                    data += '<div class="col-md-6 listandgridview">';
                                }

                                data += '<div class="card pb-0">'
                                //Header                                
                                data += '<div class="card-header"  style="background-color: #0d6efd80;"><h5 class="card-title my-0 py-0"><i><img src= "' + datatype_img + '" class="me-2" style="width:35px; height:35px;"/></i>' + metadata_title + ''
                                data += '</h5></div>'

                                //body section
                                data += '<div class="card-body px-3">'
                                data += '<div class="row">'
                                data += '<div class="col-12 col-sm-3 col-md-2"><img src= "' + imageval + '" class="border rounded dataset_img"/></div>'

                                data += '<div class="col-12 col-sm-6 col-md-8 card-text">'
                                data += '<div class="d-flex flex-wrap h-100 w-100">'
                                data += '<div class="w-100">'
                                data += metadata_abstract
                                data += '</div>'
                                data += '<div class="w-100 text-end align-content-end"><a class="mt-3" href="../adminusers/continueReading.html" onclick="DisplayMetadata_SpatialDatasets(\'' + wmsurl + '\',\'' + wmnname + '\',\'' + metadata_title + '\')">Continue Reading..</a></div></div>'
                                data += '</div>'
                                data += '<div class="col-12 col-sm-3 col-md-2"><div class="d-flex flex-wrap align-content-center justify-content-center h-100"><a href=#" title="Download" onclick="DownloadDataset(\'' + metadata_Theme + '\',\'' + wmsurl + '\',\'' + wmnname + '\',\'' + datatypeval + '\',\'' + metadata_title + '\')" class="btn btn-primary text-center align-content-center" style="font-size: 24px;"><i class="bi bi-download"></i></a></div></div>'
                                data += '</div>'
                                data += '</div>'

                                data += '</div>'
                                data += '</div>'
                                $('#baseclassDiv').append(data);
                            }
                        }
                    }//datatype condition                               
                    var id = metadatarec['geonet:info'].id;
                });    //end of foreach()                 
            });//end of get()

    };
});

function DownloadDataset(dataset_Theme,wmsurlval,datasetName,datatypeval,metadata_title) {

    var vUserName = localStorage.getItem('Username');
    var vPassword = localStorage.getItem('Password');

    if ((vUserName == null || vUserName == "") || (vPassword == null || vPassword == "")) {
        localStorage.setItem('Dataset', 'Download');
        localStorage.setItem('DatasetName', datasetName);        
        localStorage.setItem('DatasetTheme', dataset_Theme);
        localStorage.setItem('wmsurl_val', wmsurlval);
        localStorage.setItem('ls_datatypeval', datatypeval);
        
        localStorage.setItem('ls_metadata_title', metadata_title);
        msg = " Please login before download";
        $("#myModal_loginredirect").modal("show");
        $(".customtext").text(msg);
        $( ".texticon" ).append( '<i class="alerticon bi bi-shield-lock-fill text-warning"></i>' );
        return false;
    }
    else {
        $.ajax({
            type: "Get",            
           url: "http://14.142.106.205:8889/Niue/download/" + dataset_Theme,
          //  url: "http://localhost:8889/Niue/download/" + dataset_Theme,
            data: { userName: vUserName, passWord: vPassword },
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

                        if (datatypeval == "Raster") {
                            DownloadRasterDataset(datasetName,wmsurlval,metadata_title);

                        }
                        else if (datatypeval == "Vector") {
                            DownloadVectorDataset(datasetName, wmsurlval)

                        }//end of if vector condition
                    }//end of if success
                    else
                    {
                        msg = vUserName+" does not have permission to download dataset theme "+dataset_Theme;
                        $("#myModal").modal("show");
                        $(".customtext").text(msg);
                        $( ".texticon" ).append( '<i class="alerticon bi bi-shield-fill-exclamation text-warning"></i>' );
                        return false;
                    }
            
                }
            },//end of success event
            error: function (xhr, status, error) {
                msg = " Unable to download ";
                $("#myModal").modal("show");
                $(".customtext").text(msg);
                $( ".texticon" ).append( '<i class="alerticon bi bi-shield-fill-exclamation text-warning"></i>' );
                return false;
            },
            failure: function (xhr, status, failure) {
                alert(failure);
                return false;
            }
        });
    }
}
function closeAfterRedirect() {
    window.location.href = '/publicusers/loginpage.html';
}

function DownloadRasterDataset(datasetName, wmsurlval, metadata_title) {
    var dataset_metadataURL = "http://14.142.106.205:8080/geonetwork/srv/eng/q?title=" + metadata_title + "&from=1&to=20&resultType=details&fast=index&_content_type=json";

    $.get(dataset_metadataURL, function (data, status) {
        // console.log("json fired");
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

function DownloadVectorDataset(datasetName, wmsurlval)
{
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
    // input.value="og:archsites";

    //input.value = "LandCoverLandUse:LandCoverNiue_01";
    input.value = datasetName;
    //input.value = layername;
    form.appendChild(input);

    // repeat the above 5 lines for all parameters
    document.body.appendChild(form);
    form.submit();
}

function DisplayMetadata_SpatialDatasets(wmsurlval, layername,metadata_title) 
{
    localStorage.setItem('datasetname', metadata_title);
    localStorage.setItem('wmsurl', wmsurlval); 
}

function Displaymetadatadocs(metadata_Theme,dataset_deptName,dataset_description,dataset_themeName,dataset_villegeName,dataset_uploadedBy,dataset_uploadedDate,dataset_updatedby,dataset_updateddate)
{ 
    localStorage.setItem('m_datasetname', metadata_Theme);

    localStorage.setItem('m_dataset_deptName', dataset_deptName);
    localStorage.setItem('m_dataset_description', dataset_description);
    localStorage.setItem('m_dataset_themeName', dataset_themeName);
    localStorage.setItem('m_dataset_villageName', dataset_villegeName);    

    localStorage.setItem('m_dataset_uploadedBy', dataset_uploadedBy);
    localStorage.setItem('m_dataset_uploadedDate', dataset_uploadedDate);

    localStorage.setItem('m_dataset_updatedby', dataset_updatedby);
    localStorage.setItem('m_dataset_updateddate', dataset_updateddate);
}

function ViewDocMediaFiles(datasetname, datset_filepath, fileextval) {
        if (fileextval == 'jpg' || fileextval == 'jpeg' || fileextval == 'png') {

        var htmlFragment = '<div id="mapOne" border: 1px solid #A8A8A8;"></div>';

        $('<div></div>').dialog({
            width: '80%',
            height: 500,
            modal: true,
            draggable: false,

            position: {
                my: "center",
                at: "center"
            },


            title: datasetname,
            open: function () {

                $(this).html(htmlFragment);
                var img_urlpath = window.location.origin;
                var imgurl = datset_filepath;

                var image_holder = $("#mapOne");
                $("<img />", { "src": imgurl, "id": "imgFull" }).appendTo(image_holder);
                $("#mapOne").width(document.getElementById("imgFull").width);
                $("#mapOne").height(document.getElementById("imgFull").height);
                $('body, html').css('overflow', 'hidden');
            },
            close: function () {
                $(this).dialog("destroy").remove();
                $('body, html').css('overflow', 'auto');
            }
        });  //end confirm dialog  
    }
    else {
        var $a = $('<a />', {
            'href': datset_filepath,
            'target': "_blank"
        }).hide().appendTo("body")[0].click();
    }
}

function DownloadDocMediaFiles_v2(fileextval, datset_filepath, filename) {

    // var imgurl = "http://14.142.106.205:8080/hfserver/Health/2702/niuepng2.jpg";     
    var imgurl = datset_filepath;
    var $a = $('<a />', {
        'href': imgurl,
        'download': filename,
        'target': "_blank"
    }).hide().appendTo("body")[0].click();
}

  
  function DownloadDocMediaFiles(dataset_Theme,datset_filepath,fileextval,filename)
{ 
    var vUserName = localStorage.getItem('Username');
    var vPassword = localStorage.getItem('Password');

    if ((vUserName == null || vUserName == "") || (vPassword == null || vPassword == "")) {
        localStorage.setItem('Dataset', 'download_docs_media');
        localStorage.setItem('DatasetName', filename);        
        localStorage.setItem('DatasetTheme', dataset_Theme);
        localStorage.setItem('ls_datset_filepath',datset_filepath );
        localStorage.setItem('Dataset_ext', fileextval);
        
       // localStorage.setItem('wmsurl_val', wmsurlval);
        msg = " Please login before download";
        $("#myModal_loginredirect").modal("show");
        $(".customtext").text(msg);
        $( ".texticon" ).append( '<i class="alerticon bi bi-shield-lock-fill text-warning"></i>' );
        return false;
    }
    else {
        $.ajax({
            type: "Get",            
            url: "http://14.142.106.205:8889/Niue/download/" + dataset_Theme,
           // url: "http://localhost:8889/Niue/download/" + dataset_Theme,
            data: { userName: vUserName, passWord: vPassword },
            async: false,
            success: function (response) {
                if (response != null && response != '') {                    
                    var arrRes = response.split("?")                                                           
                    if (arrRes[1] != null && arrRes[1] != '' && arrRes[1] != 'null'){
                        var arrRoleDeprt = arrRes[1].split("&")
                        localStorage.setItem('Role',arrRoleDeprt[0]);
                        localStorage.setItem('Department',arrRoleDeprt[1]);
                    }
                    if(arrRes[0] =='Success'){ 
                       DownloadDocMediaFiles_v2(fileextval,datset_filepath,filename);   
                    }
                    else
                    {
                        msg = vUserName+" does not have permission to download dataset theme "+dataset_Theme;
                        $("#myModal").modal("show");
                        $(".customtext").text(msg);
                        $( ".texticon" ).append( '<i class="alerticon bi bi-shield-fill-exclamation text-warning"></i>' );
                        return false;
                    }
                }
            },
            error: function (xhr, status, error) {
                msg = " Unable to download ";
                $("#myModal").modal("show");
                $(".customtext").text(msg);
                $( ".texticon" ).append( '<i class="alerticon bi bi-shield-fill-exclamation text-warning"></i>' );
                return false;
            },
            failure: function (xhr, status, failure) {
                alert(failure);
                return false;
            }
        });
    }
}