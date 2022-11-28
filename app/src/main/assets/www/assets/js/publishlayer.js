$(document).ready(function() {
	
	if($("#publishlayerstatus").text()!=""){
		//jAlert($("#publishlayerstatus").text(),"Publish Layer");
	}
	
	loadworkspaces();
	
	$('#idsrs').on('change',function(event){
		var selectedType = $(this).val();
		
		if(selectedType != 0) {
			if(selectedType == ".shp") {
				$('#idsfile').attr("accept",".zip");
			}
			else if(selectedType == ".tif") {
				$('#idsfile').attr("accept",".tif");
			}
		}
		else {
			alert("LayerType is Required");
		}
		$("#idsfile").val('');
	});
	
	$('#selectworkspace').on('change', function(event) {
		var selectedWS = $(this).val();
		if (selectedWS != "0") {
			$.ajax({
				url : "http://14.142.106.205:8889/loadlayersby.htm",
				//url : "http://localhost:8889/loadlayersby.htm",
				type : "GET",
				data : {workSpaceName:$(this).val()},
				success : function(response){
					
					var select = $('#featureName');
					select.find('option').remove();
					$('<option>').val(-1).text('Select Layer').appendTo(select);
					$.each(response, function(key, value) {
						$('<option>').val(key).text(value).appendTo(select);
					});
				}
			});
			
		} else {
			var select = $('#featureName');
			select.find('option').remove();
			$('<option>').val(0).text('Select Layer').appendTo(select);
		}
	});
});

function publish(evt) {
	if (document.getElementById("createworkspace").value == ''
			&& document.getElementById("selectworkspace").value == "0") {
		alert("WorkSpace is Required");
		evt.preventDefault();
		return false;
	} else {
		document.getElementById("sformId").submit();
	}
};

function fillWorkspaceName() {
	document.getElementsByName("storeName")[0].value = "";
	document.getElementsByName("layerName")[0].value = "";
	//document.getElementsByName("srs")[0].selectedIndex = 0;
	document.getElementsByName("defaultStyle")[0].selectedIndex = 0;
	document.getElementsByName("sfile")[0].value = "";

	if (document.getElementById("selectworkspace").value != "0") {
		document.getElementById("createworkspace").value = document
				.getElementById("selectworkspace").value;
	} else {
		document.getElementById("createworkspace").value = "";
		document.getElementById("featureName").value = "0";
	}

	document.getElementById("llpreview").style.display = "none";
	
};

function disableUploadSld() {
	var defaultStyleId = document.getElementById("defaultStyle");
	if (defaultStyleId.selectedIndex == 0) {
		document.getElementById("sldfile").disabled = false;
	} else {
		var selectedText = defaultStyleId.options[defaultStyleId.selectedIndex].text;
		document.getElementById("sldfile").disabled = true;
		document.getElementById("defaultStyle").value = selectedText;
	}
}

function preview() {
	document.getElementById("lpreview").style.display = 'block';
};

var count = 0;
var lcount = 0;
var frontmap;
var wmsLayer;
function previewLayer() {
	
	if($("#selectworkspace").val()=="0"){
		//jAlert("Please select Existing Workspace","Data Management");
		return false;
	}
	else{
	document.getElementById("selectworkspace").style.border = "0px";
	document.getElementById("featureName").style.border = "0px";
	$('#selectworkspacediv').removeClass('tooltip2');
	$('#featureNamediv').removeClass('tooltip2');
	document.getElementById('selectworkspacespan').innerHTML = "";
	document.getElementById('featureNamespan').innerHTML = "";

	var webMapServiceUrl;
	var showpreview = document.getElementById("selectworkspace").value;
	var layerSelect = document.getElementById("featureName").value;

	if (showpreview == "0") {
		document.getElementById("selectworkspace").style.border = "1px solid red";
		$('#selectworkspacediv').addClass('tooltip2');
		document.getElementById('selectworkspacespan').innerHTML = "Please Select WorkSpace.";
	}
	if (layerSelect == "-1") {
		document.getElementById("featureName").style.border = "1px solid red";
		$('#featureNamediv').addClass('tooltip2');
		document.getElementById('featureNamespan').innerHTML = "Please Select Layer.";
	}

	if (showpreview != "0" && layerSelect != "-1") {
		
		var workspace =document.getElementById("selectworkspace").value;

		var sel = document.getElementById("featureName");
		var ltext =sel.options[sel.selectedIndex].text;
		layerPreview(workspace, ltext);
	}
	}
}



function closeModal() {
	document.getElementById("myModal").style.display = 'none';
	document.getElementById("myModalLayer").style.display = 'none';
}

function clearPreview() {
	document.getElementById("llpreview").style.display = "none";
}

function loadworkspaces(){
	$.ajax({
		url: "http://14.142.106.205:8889/loadworkspaces.htm",
		//url: "http://localhost:8889/loadworkspaces.htm",
		//url : "loadworkspaces.htm",
		type : "GET",
		success : function(response){
			
			$.each(response.styles,function(index,value){
				$("#defaultStyle").append('<option value="'+value+'">'+value+'</option>');
			});
			
			$.each(response.workspaces,function(index,value){
				$("#selectworkspace").append('<option value="'+value+'">'+value+'</option>');
			});
			
			$("#geoserverurl").val(response.geoserverurl);
			$("#createworkspace").val(response.workspacename);
			
			previewAndAttachThumbnail();
		}
	});
}
var isempty;
function publishLayerValidation(){
	
	isempty=false;
	
	$(".validationform .form-control").each(function(index,value){
		if($(this).val()=="" && $(this).attr('type')!='file'){
			//jAlert("Please enter "+$(this).attr('data'),'Data Management');
			isempty=true;
			return false;
		}else if($(this).val()=="0" && $(this).attr('id')!="defaultStyle"){
			//jAlert("Please select "+$(this).attr('data'),'Data Management');
			isempty=true;
			return false;
		}else if($(this).val().length<4 && $(this).attr('type')!='file' && $(this).attr('id')!="defaultStyle"){
			//jAlert($(this).attr('data')+" minmum length should be 4",'Data Management');
			isempty=true;
			return false;
		}
	});
/*	
	if($("#title").val()==""){
		jAlert("Please enter Title","Data Management");
		return false;
	}else if($("#date").val()==""){
		jAlert("Please enter Date","Data Management");
		return false;
	}else if($("#abstractdata").val()==""){
		jAlert("Please enter Abstract","Data Management");
		return false;
	}else if($("#purpose").val()==""){
		jAlert("Please enter Purpose","Data Management");
		return false;
	}else if($("#individualname").val()==""){
		jAlert("Please enter Individual Name","Data Management");
		return false;
	}else if($("#organizationname").val()==""){
		jAlert("Please enter Organization Name","Data Management");
		return false;
	}else if($("#positionname").val()==""){
		jAlert("Please enter Position Name","Data Management");
		return false;
	}else if($("#city").val()==""){
		jAlert("Please enter City","Data Management");
		return false;
	}else if($("#postalcode").val()==""){
		jAlert("Please enter Postalcode","Data Management");
		return false;
	}else if($("#country").val()==""){
		jAlert("Please enter Country","Data Management");
		return false;
	}else if($("#email").val()==""){
		jAlert("Please enter Email","Data Management");
		return false;
	}else if($("#keyword1").val()==""){
		jAlert("Please enter Keyword1","Data Management");
		return false;
	}else if($("#keyword2").val()==""){
		jAlert("Please enter Keyword2","Data Management");
		return false;
	}else if($("#protocol1").val()==""){
		jAlert("Please enter Protocol","Data Management");
		return false;
	}else if($("#description1").val()==""){
		jAlert("Please enter Description","Data Management");
		return false;
	}
	else if($("#idstoreName").val()==""){
		jAlert("Please enter Store Name","Data Management");
		return false;
	}
	else if($("#idlayerName").val()==""){
		jAlert("Please enter Layer Name","Data Management");
		return false;
	}else if(!emailStatus){
		jAlert("Please enter valid Email id","Data Management");
		return false;
		
	}*/
	if (isempty == false) {
		publishLayerWithMetadata();
	
	}
}

function publishLayerWithMetadata(){
	
	var emailRegex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z-])+\.)+([a-zA-Z0-9.]{2,6})+$/;
	
	if($("#email").val()!=""){
	var emailStatus = emailRegex.test($("#email").val());
	}
	

	
	if($("#idsfile").val()==""){
		//jAlert("Please Choose the Shape file",'Data Management');
		isempty=true;
		return false;
	}

	 
	else if(emailStatus == false){
		//jAlert("Please enter valid Email id","Data Management");
		isempty=true;
		return false;
		}
	
	if($("#idsfile").val() !="" ){
		var shpFilePath = $("#idsfile").val().toLowerCase();
		var givenLayerName = $("#idlayerName").val().toLowerCase();
		if($('#idsrs').val().trim()==".shp"){
			 if(!(shpFilePath.includes(".zip") ||shpFilePath.includes(".rar") )){		
					//jAlert("Add .zip extension file only","Data Management");
					
					isempty=true;
					return false;
				}
			 if(!(shpFilePath.includes(givenLayerName+".zip") || shpFilePath.includes(givenLayerName+".rar"))){
					//jAlert("Uploaded file name should be same as entered Layer Name","Data Management");
					$("#idsfile").val('');
					isempty=true;
					return false;
				}
		}
		else if($('#idsrs').val().trim()==".tif"){
		 if(!(shpFilePath.includes(".tif"))){
				
				//jAlert("Add .tif extension file only","Data Management");
				$("#idsfile").val('');
				isempty=true;
				return false;
			}
		 if(!(shpFilePath.includes(givenLayerName+".tif"))){
				//jAlert("Uploaded file name should be same as entered Layer Name","Data Management");
				$("#idsfile").val('');
				isempty=true;
				return false;
			}
		}
	}
	
	//if is empty then validation is there
	if (isempty) {
		isempty = false;
		return false;
	} else {
		var data = callData();
		$.ajax({
			url : 'http://14.142.106.205:8889/addmetadatacatalog.htm',
			//url : 'http://localhost:8889/addmetadatacatalog.htm',
			type : 'GET',
			contentType : 'application/json',
			data : data,
			success : function(response) {
				if (response.status == 'true') {
					$('#metadataid').val(response.metadataid);
					 document.publishlayerform.action="publishlayer.htm";
					 document.publishlayerform.enctype="multipart/form-data";
					 document.publishlayerform.submit();
				} else {
					//jAlert("problem in adding the record");
				}

			}
		});
	}
}

function callData(){
	var data = {
			title : $("#title").val(),
			date  : $("#date").val(),
			abstractdata : $("#abstractdata").val(),
			role  : $("#role").val(),
			maintainanceupdatefrequency : $("#maintainanceupdatefrequency").val(),
			purpose : $("#purpose").val(),
			individualname : $("#individualname").val(),
			organizationname : $("#organizationname").val(),
			positionname : $("#positionname").val(),
			city : $("#city").val(),
			postalcode : $("#postalcode").val(),
			country : $("#country").val(),
			email : $("#email").val(),
			keyword1 : $("#keyword1").val(),
			keyword2 : $("#keyword2").val(),
			linkage1 : $("#linkage1").val(),
			protocol1 : $("#protocol1").val(),
			resource1 : $("#idlayerName").val(),
			description1 : $("#description1").val(),
			
			linkage2 : "linkage2",
			protocol2 :"protocol2",
			resource2 : "resource2",
			description2 : "description2",
		}
	/*
	$.each( data, function( key, value ) {
		  alert( key + ": " + value );
		});*/
	
	return data;
}

function previewAndAttachThumbnail(){
	var bStatus=$('#bstatus').val();
	var layername=$('#prelayerName').val();
	if(bStatus==true || bStatus=='true'){
		layerPreview($("#createworkspace").val(),layername);
		
		setTimeout(function(){
			sendThumbNailToServer($('#metadataid').val());
		}, 1000);
		//layerPreview($("#createworkspace").val(),layername);
		//sendThumbNailToServer($('#metadataid').val());
	}
}

function layerPreview(workSpaceName, layerName){
	document.getElementById("llpreview").style.display = 'block';
	var url = document.getElementById("geoserverurl").value + '/';
	// alert(url);
	var workspace =workSpaceName;// document.getElementById("selectworkspace").value;

	var sel = layerName;//document.getElementById("featureName");
	var ltext =layerName;// sel.options[sel.selectedIndex].text;

	var workspacelayer = workspace + ":" + ltext;
	webMapServiceUrl = url + workspace + '/wms'; // Web map service URL
	var basemapProjection = 'EPSG:4326';
	var latitude = '73.8611';
	var longitude = '18.6378';
	if (lcount == 1) {
		wmsLayer.setVisible(false);
		lcount = 0;
	}
	wmsLayer = new ol.layer.Tile({
		title : ltext,
		visible : true,
		source : new ol.source.TileWMS({
			url : webMapServiceUrl,
			crossOrigin: 'anonymous',
			params : {
				'LAYERS' : workspacelayer
			},
			serverType : 'geoserver'
		})
	});

	/* Float Conversion of Coordinates */
	var lat = parseFloat(latitude);
	var lon = parseFloat(longitude);

	/* Projection view specifications */
	var startView = new ol.View({
		center : ol.proj.transform([ lat, lon ], basemapProjection,'EPSG:3857'),
		zoom : 8
	});

	/* Creating map object */
	if (count == 0) {
		frontmap = new ol.Map({
			target : 'frontmap',
			layers : [ wmsLayer ], // Add base map first
			view : startView
		});
		lcount = 1;
	} else {
		frontmap.addLayer(wmsLayer);
		lcount = 1;
	}
	count++;
}

function sendThumbNailToServer(metadataid){
	// get the canvas image
	frontmap.once('postcompose', function(event1) {
		canvas = event1.context.canvas;
		var imageDataURL = canvas.toDataURL('image/png');
		// send the canvas image to the server
		var ajax = new XMLHttpRequest();
		ajax.open("POST", "uploadthumbnail.htm?uniqueIdentifier="+metadataid, true);
		ajax.setRequestHeader("Content-Type", "application/upload");
		ajax.send(imageDataURL);
	});
	frontmap.renderSync();
}



$(function(){
	
	hidepointstylediv();
	$("#pointimagediv").css("display","block");
	$("#pointsldstyletype").change(function(e){
	
    if($(this).val() == 'image') {
    	hidepointstylediv();
    	$("#pointimagediv").css("display","block");
    	
    	
    } else if($(this).val() == 'symbol') {
    	hidepointstylediv();
    	$("#pointsymboldiv").css("display","block");
    
    } else if($(this).val() == 'label') {
    	getproperties();
    	hidepointstylediv();
    	$("#pointlabeldiv").css("display","block");
    	
    } else if($(this).val() == 'symwithlabel') {
    	getproperties();
    	hidepointstylediv();
    	$("#pointsymboldiv").css("display","block");
    	$("#pointlabeldiv").css("display","block");
    	
    	    	
    } else if($(this).val() == 'imgwithlabel') {
    	getproperties();
    	hidepointstylediv();
    	$("#pointimagediv").css("display","block");
    	$("#pointlabeldiv").css("display","block");
    	    	
    }
});
	
	$('#zoomenabled').click(function() {
	    $("#zoomrulediv").toggle(this.checked);
	});
	
});

function hidepointstylediv(){
	$("#pointimagediv").css("display","none");
	$("#pointsymboldiv").css("display","none");
	$("#pointlabeldiv").css("display","none");
}


function pointSLDCreation(){
	
	//$("#stylepreview").slideToggle('slow');
	$("#stylepreview").css("opacity","1");
	$("#stylepreview").css("z-index", "5");
	//layerPreview2("PMRDAWorkSpace","http://192.168.100.111:8080/geoserver","rainfallstations_master");
	var layerName = $('#prelayerName').val();
	layerPreview2($('#preworkspaceName').val(),$('#geoserverurl').val(),layerName);
	
}

function closesldcreation(){
	$("#stylepreview").css("opacity","0");
	$("#stylepreview").css("z-index", "-1");
}

function generatesld(){

var sldgentype = $("#pointsldstyletype").val();
var generatedcode = ""; 
if(sldgentype == "image"){
	generatedcode = generatepointimageSLD();
} else if(sldgentype == "symbol"){
	generatedcode = generatepointsymbolSLD();
} else if(sldgentype == "label"){
	generatedcode = generatepointlabelSLD();
} else if(sldgentype == "symwithlabel"){
	generatedcode = generatepointsymbollabelSLD();
} else if(sldgentype == "imgwithlabel"){
	generatedcode = generatepointimglabelSLD();
} 
   document.getElementById('styleCode').value = generatedcode;
   var layerName = $('#prelayerName').val();
   var styleName = $('#prestyleName').val();
   var workspaceName = $('#preworkspaceName').val();
   console.log("styleName : "+styleName);
   console.log("layerName : "+layerName);
   console.log("workspaceName : "+workspaceName);
   
   
   $.ajax({
		url : "http://14.142.106.205:8889/updateStyle.htm",
		//url : "http://localhost:8889/updateStyle.htm",
		data : {
			styleCode : generatedcode,
			workspaceName : workspaceName,
			layerName: layerName,
			styleName: styleName
		},
		type : "GET",
		success : function(response){
			console.log("Updated the style");
			console.log("type: " +sldgentype + "code:" +generatedcode);
			
			layerPreview2("PMRDAWorkSpace","http://172.16.30.79:8080/geoserver",layerName);
		}
	});   
}

function generatepointimageSLD(){
	
	var sldimagename = $("#sldpointimagename").val().split('\\')[2];
	var sldpointimagesize = $("#sldpointimagesize").val();
	
	var sldpointlabelminsdmntr = $("#sldpointminscalednmtr").val();
	var sldpointlabelmaxsdmntr = $("#sldpointmaxscalednmtr").val();
	var sldpointlabelminsdmntrsize = $("#sldpointminscalednmtrsize").val();
	var sldpointlabelmaxsdmntrsize = $("#sldpointmaxscalednmtrsize").val();
	
	var pointimgsldstart = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">	  <NamedLayer><Name>Point</Name><UserStyle>  <Title>Point Style</Title><FeatureTypeStyle>';
	var pointimgsldend = '</FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';
	
	var pointimagepath = '<Rule>     <PointSymbolizer><Graphic>  <ExternalGraphic>    <OnlineResource      xlink:type="simple"      xlink:href="'+sldimagename+'" />    <Format>image/png</Format>  </ExternalGraphic>  <Size>'+sldpointimagesize+'</Size></Graphic></PointSymbolizer></Rule>';
	
	var pointimagemaxpath = '<Rule><MaxScaleDenominator>'+ sldpointlabelmaxsdmntr +'</MaxScaleDenominator>     <PointSymbolizer><Graphic>  <ExternalGraphic>    <OnlineResource      xlink:type="simple"      xlink:href="'+sldimagename+'" />    <Format>image/png</Format>  </ExternalGraphic>  <Size>'+sldpointlabelmaxsdmntrsize+'</Size></Graphic></PointSymbolizer></Rule>';
	var pointimageminpath = '<Rule><MinScaleDenominator>'+ sldpointlabelminsdmntr +'</MinScaleDenominator>    <PointSymbolizer><Graphic>  <ExternalGraphic>    <OnlineResource      xlink:type="simple"      xlink:href="'+sldimagename+'" />    <Format>image/png</Format>  </ExternalGraphic>  <Size>'+sldpointlabelminsdmntrsize+'</Size></Graphic></PointSymbolizer></Rule>';
	
	var pointimagesldcode = "";
	
	if($("#zoomenabled").is(':checked')){
		pointimagesldcode = pointimgsldstart + pointimagemaxpath + pointimageminpath + pointimgsldend;
	}
	   
	else{
		pointimagesldcode = pointimgsldstart + pointimagepath + pointimgsldend;
	
	}
	return pointimagesldcode;
	
	//console.log(pointgraphicsld);
}

function generatepointsymbolSLD(){
	
	var sldsymboltype = $("#sldpointsymbolstyle").val();
	var sldpointsymbolsize = $("#sldpointsymbolsize").val();
	var sldpointsymbolfillcolor = $("#sldpointsymbolfillcolor").val();
	var sldpointsymbolfillopacity = $("#sldpointsymbolfillcoloropacity").val();
	var sldpointsymbolstrokecolor = $("#sldpointsymbolstrokecolor").val();
	var sldpointsymbolstrokewidth = $("#sldpointsymbolstrokewidth").val();
	  
	var sldpointlabelminsdmntr = $("#sldpointminscalednmtr").val();
	var sldpointlabelmaxsdmntr = $("#sldpointmaxscalednmtr").val();
	var sldpointlabelminsdmntrsize = $("#sldpointminscalednmtrsize").val();
	var sldpointlabelmaxsdmntrsize = $("#sldpointmaxscalednmtrsize").val();
	
	var pointsymbolsldstart = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">	  <NamedLayer><Name>Point</Name><UserStyle>  <Title>Point Style</Title><FeatureTypeStyle>';
	var pointsymbolsldend = '</FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';
	var pointsymbolstyle = ' <Rule>  <PointSymbolizer>    <Graphic>      <Mark>        <WellKnownName>'+sldsymboltype+'</WellKnownName>        <Fill>  <CssParameter name="fill">'+sldpointsymbolfillcolor+'</CssParameter>          <CssParameter name="fill-opacity">'+sldpointsymbolfillopacity+'</CssParameter> </Fill>        <Stroke>          <CssParameter name="stroke">'+sldpointsymbolstrokecolor+'</CssParameter>          <CssParameter name="stroke-width">'+sldpointsymbolstrokewidth+'</CssParameter>        </Stroke>      </Mark>      <Size>'+sldpointsymbolsize+'</Size>    </Graphic>  </PointSymbolizer></Rule>';
	
	var pointminsymbolstyle = ' <Rule> <MainScaleDenominator>'+ sldpointlabelminsdmntr +'</MinScaleDenominator> <PointSymbolizer>    <Graphic>      <Mark>        <WellKnownName>'+sldsymboltype+'</WellKnownName>        <Fill>  <CssParameter name="fill">'+sldpointsymbolfillcolor+'</CssParameter>          <CssParameter name="fill-opacity">'+sldpointsymbolfillopacity+'</CssParameter> </Fill>        <Stroke>          <CssParameter name="stroke">'+sldpointsymbolstrokecolor+'</CssParameter>          <CssParameter name="stroke-width">'+sldpointsymbolstrokewidth+'</CssParameter>        </Stroke>      </Mark>      <Size>'+sldpointlabelminsdmntrsize+'</Size>    </Graphic>  </PointSymbolizer></Rule>';
	var pointsmaxymbolstyle = ' <Rule> <MaxScaleDenominator>'+ sldpointlabelmaxsdmntr +'</MaxScaleDenominator> <PointSymbolizer>    <Graphic>      <Mark>        <WellKnownName>'+sldsymboltype+'</WellKnownName>        <Fill>  <CssParameter name="fill">'+sldpointsymbolfillcolor+'</CssParameter>          <CssParameter name="fill-opacity">'+sldpointsymbolfillopacity+'</CssParameter> </Fill>        <Stroke>          <CssParameter name="stroke">'+sldpointsymbolstrokecolor+'</CssParameter>          <CssParameter name="stroke-width">'+sldpointsymbolstrokewidth+'</CssParameter>        </Stroke>      </Mark>      <Size>'+sldpointlabelmaxsdmntrsize+'</Size>    </Graphic>  </PointSymbolizer></Rule>';
	var pointsymbolsldcode = "";		
	if($("#zoomenabled").is(':checked')){
		pointsymbolsldcode =  pointsymbolsldstart + pointminsymbolstyle + pointsmaxymbolstyle + pointsymbolsldend;
	}
	   
	else{
		pointsymbolsldcode = pointsymbolsldstart + pointsymbolstyle + pointsymbolsldend;
	
	}
	return pointsymbolsldcode;
}

function  generatepointlabelSLD(){
	
	var sldsymboltype = $("#sldpointsymbolstyle").val();
	var sldpointsymbolsize = $("#sldpointsymbolsize").val();
	var sldpointsymbolfillcolor = $("#sldpointsymbolfillcolor").val();
	var sldpointsymbolfillopacity = $("#sldpointsymbolfillcoloropacity").val();
	var sldpointsymbolstrokecolor = $("#sldpointsymbolstrokecolor").val();
	var sldpointsymbolstrokewidth = $("#sldpointsymbolstrokewidth").val();
	
	var sldlabelname = $("#sldpointpropertyname").val();
	var sldpointlabelfcolor = $("#sldpointfontcolor").val();
	var sldpointlabelffamily = $("#sldpointfontfamily").val();
	var sldpointlabelfsize = $("#sldpointfontsize").val();
	var sldpointlabelfstyle = $("#sldpointfontstyle").val();
	var sldpointlabelfweight = $("#sldpointfontweight").val();
	var sldpointlabelapx = $("#sldpointanchorpointx").val();
	var sldpointlabelapy = $("#sldpointanchorpointy").val();
	var sldpointlabelpdx = $("#sldpointdisplacementx").val();
	var sldpointlabelpdy = $("#sldpointdisplacementy").val();
	var sldpointlabelrotation = $("#sldpointlablerotation").val();
	var sldpointlabelminsdmntr = $("#sldpointminscalednmtr").val();
	var sldpointlabelmaxsdmntr = $("#sldpointmaxscalednmtr").val();
	var sldpointlabelminsdmntrsize = $("#sldpointminscalednmtrsize").val();
	var sldpointlabelmaxsdmntrsize = $("#sldpointmaxscalednmtrsize").val();
	
	var pointlabelsldstart = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">	  <NamedLayer><Name>Point</Name><UserStyle>  <Title>Point Style</Title><FeatureTypeStyle>';
	var pointlabelsldend = '</FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';
	
	var pointlabelstyle = ' <Rule> <PointSymbolizer>    <Graphic>      <Mark>        <WellKnownName>'+sldsymboltype+'</WellKnownName>        <Fill>  <CssParameter name="fill">'+sldpointsymbolfillcolor+'</CssParameter>          <CssParameter name="fill-opacity">'+sldpointsymbolfillopacity+'</CssParameter> </Fill>        <Stroke>          <CssParameter name="stroke">'+sldpointsymbolstrokecolor+'</CssParameter>          <CssParameter name="stroke-width">'+sldpointsymbolstrokewidth+'</CssParameter>        </Stroke>      </Mark>      <Size>'+sldpointsymbolsize+'</Size>    </Graphic>  </PointSymbolizer> <TextSymbolizer>  <Label>    <ogc:PropertyName>'+sldlabelname+'</ogc:PropertyName>  </Label>  <Font>     <CssParameter name="font-family">'+ sldpointlabelffamily +'</CssParameter> <CssParameter name="font-size">'+sldpointlabelfsize+'</CssParameter>     <CssParameter name="font-style">'+sldpointlabelfstyle+'</CssParameter>     <CssParameter name="font-weight">'+sldpointlabelfweight +'</CssParameter>  </Font>   <LabelPlacement>    <PointPlacement>      <AnchorPoint>        <AnchorPointX>'+ sldpointlabelapx+'</AnchorPointX>      <AnchorPointY>'+ sldpointlabelapy +'</AnchorPointY> </AnchorPoint>       <Displacement>        <DisplacementX>'+sldpointlabelpdx+'</DisplacementX>        <DisplacementY>'+sldpointlabelpdy+'</DisplacementY>      </Displacement>      </PointPlacement>  </LabelPlacement>  <Fill>    <CssParameter name="fill">'+ sldpointlabelfcolor +'</CssParameter>  </Fill></TextSymbolizer></Rule>';
	
	var pointlabelstylemax = ' <Rule>  <MaxScaleDenominator>'+ sldpointlabelmaxsdmntr +'</MaxScaleDenominator> <PointSymbolizer>    <Graphic>      <Mark>        <WellKnownName>'+sldsymboltype+'</WellKnownName>        <Fill>  <CssParameter name="fill">'+sldpointsymbolfillcolor+'</CssParameter>          <CssParameter name="fill-opacity">'+sldpointsymbolfillopacity+'</CssParameter> </Fill>        <Stroke>          <CssParameter name="stroke">'+sldpointsymbolstrokecolor+'</CssParameter>          <CssParameter name="stroke-width">'+sldpointsymbolstrokewidth+'</CssParameter>        </Stroke>      </Mark>      <Size>'+sldpointlabelmaxsdmntrsize+'</Size>    </Graphic>  </PointSymbolizer> <TextSymbolizer>  <Label>    <ogc:PropertyName>'+sldlabelname+'</ogc:PropertyName>  </Label>  <Font>     <CssParameter name="font-family">'+ sldpointlabelffamily +'</CssParameter> <CssParameter name="font-size">'+sldpointlabelminsdmntrsize+'</CssParameter>     <CssParameter name="font-style">'+sldpointlabelfstyle+'</CssParameter>     <CssParameter name="font-weight">'+sldpointlabelfweight +'</CssParameter>  </Font>   <LabelPlacement>    <PointPlacement>      <AnchorPoint>        <AnchorPointX>'+ sldpointlabelapx+'</AnchorPointX>      <AnchorPointY>'+ sldpointlabelapy +'</AnchorPointY> </AnchorPoint>       <Displacement>        <DisplacementX>'+sldpointlabelpdx+'</DisplacementX>        <DisplacementY>'+sldpointlabelpdy+'</DisplacementY>      </Displacement>      </PointPlacement>  </LabelPlacement>  <Fill>    <CssParameter name="fill">'+ sldpointlabelfcolor +'</CssParameter>  </Fill></TextSymbolizer></Rule>';
	var pointlabelstylemin = ' <Rule>  <MinScaleDenominator>'+ sldpointlabelminsdmntr +'</MinScaleDenominator> <PointSymbolizer>    <Graphic>      <Mark>        <WellKnownName>'+sldsymboltype+'</WellKnownName>        <Fill>  <CssParameter name="fill">'+sldpointsymbolfillcolor+'</CssParameter>          <CssParameter name="fill-opacity">'+sldpointsymbolfillopacity+'</CssParameter> </Fill>        <Stroke>          <CssParameter name="stroke">'+sldpointsymbolstrokecolor+'</CssParameter>          <CssParameter name="stroke-width">'+sldpointsymbolstrokewidth+'</CssParameter>        </Stroke>      </Mark>      <Size>'+sldpointlabelminsdmntrsize+'</Size>    </Graphic>  </PointSymbolizer> <TextSymbolizer>  <Label>    <ogc:PropertyName>'+sldlabelname+'</ogc:PropertyName>  </Label>  <Font>     <CssParameter name="font-family">'+ sldpointlabelffamily +'</CssParameter> <CssParameter name="font-size">'+sldpointlabelmaxsdmntrsize+'</CssParameter>     <CssParameter name="font-style">'+sldpointlabelfstyle+'</CssParameter>     <CssParameter name="font-weight">'+sldpointlabelfweight +'</CssParameter>  </Font>   <LabelPlacement>    <PointPlacement>      <AnchorPoint>        <AnchorPointX>'+ sldpointlabelapx+'</AnchorPointX>      <AnchorPointY>'+ sldpointlabelapy +'</AnchorPointY> </AnchorPoint>       <Displacement>        <DisplacementX>'+sldpointlabelpdx+'</DisplacementX>        <DisplacementY>'+sldpointlabelpdy+'</DisplacementY>      </Displacement>      </PointPlacement>  </LabelPlacement>  <Fill>    <CssParameter name="fill">'+ sldpointlabelfcolor +'</CssParameter>  </Fill></TextSymbolizer></Rule>';
	
	var pointlabelsldcode = ""; 
	
	if($("#zoomenabled").is(':checked')){
		pointlabelsldcode = pointlabelsldstart + pointlabelstylemax + pointlabelstylemin + pointlabelsldend;
	}
	   
	else{
		pointlabelsldcode = pointlabelsldstart + pointlabelstyle + pointlabelsldend;
	
	}
	return pointlabelsldcode;

}


function  generatepointsymbollabelSLD(){
	
	var sldsymboltype = $("#sldpointsymbolstyle").val();
	var sldpointsymbolsize = $("#sldpointsymbolsize").val();
	var sldpointsymbolfillcolor = $("#sldpointsymbolfillcolor").val();
	var sldpointsymbolfillopacity = $("#sldpointsymbolfillcoloropacity").val();
	var sldpointsymbolstrokecolor = $("#sldpointsymbolstrokecolor").val();
	var sldpointsymbolstrokewidth = $("#sldpointsymbolstrokewidth").val();
	
	var sldlabelname = $("#sldpointpropertyname").val();
	var sldpointlabelfcolor = $("#sldpointfontcolor").val();
	var sldpointlabelffamily = $("#sldpointfontfamily").val();
	var sldpointlabelfsize = $("#sldpointfontsize").val();
	var sldpointlabelfstyle = $("#sldpointfontstyle").val();
	var sldpointlabelfweight = $("#sldpointfontweight").val();
	var sldpointlabelapx = $("#sldpointanchorpointx").val();
	var sldpointlabelapy = $("#sldpointanchorpointy").val();
	var sldpointlabelpdx = $("#sldpointdisplacementx").val();
	var sldpointlabelpdy = $("#sldpointdisplacementy").val();
	var sldpointlabelrotation = $("#sldpointlablerotation").val();
	var sldpointlabelminsdmntr = $("#sldpointminscalednmtr").val();
	var sldpointlabelmaxsdmntr = $("#sldpointmaxscalednmtr").val();
	var sldpointlabelminsdmntrsize = $("#sldpointminscalednmtrsize").val();
	var sldpointlabelmaxsdmntrsize = $("#sldpointmaxscalednmtrsize").val();
	
	var pointlabelsldstart = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">	  <NamedLayer><Name>Point</Name><UserStyle>  <Title>Point Style</Title><FeatureTypeStyle>';
	var pointlabelsldend = '</FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';
	
	var pointlabelstyle = ' <Rule><PointSymbolizer>    <Graphic>      <Mark>        <WellKnownName>'+sldsymboltype+'</WellKnownName>        <Fill>  <CssParameter name="fill">'+sldpointsymbolfillcolor+'</CssParameter>          <CssParameter name="fill-opacity">'+sldpointsymbolfillopacity+'</CssParameter> </Fill>        <Stroke>          <CssParameter name="stroke">'+sldpointsymbolstrokecolor+'</CssParameter>          <CssParameter name="stroke-width">'+sldpointsymbolstrokewidth+'</CssParameter>        </Stroke>      </Mark>      <Size>'+sldpointsymbolsize+'</Size>    </Graphic>  </PointSymbolizer> <TextSymbolizer>  <Label>    <ogc:PropertyName>'+sldlabelname+'</ogc:PropertyName>  </Label>  <Font>     <CssParameter name="font-family">'+ sldpointlabelffamily +'</CssParameter> <CssParameter name="font-size">'+sldpointlabelfsize+'</CssParameter>     <CssParameter name="font-style">'+sldpointlabelfstyle+'</CssParameter>     <CssParameter name="font-weight">'+sldpointlabelfweight +'</CssParameter>  </Font>   <LabelPlacement>    <PointPlacement>      <AnchorPoint>        <AnchorPointX>'+ sldpointlabelapx+'</AnchorPointX>      <AnchorPointY>'+ sldpointlabelapy +'</AnchorPointY> </AnchorPoint>       <Displacement>        <DisplacementX>'+sldpointlabelpdx+'</DisplacementX>        <DisplacementY>'+sldpointlabelpdy+'</DisplacementY>      </Displacement>      </PointPlacement>  </LabelPlacement>  <Fill>    <CssParameter name="fill">'+ sldpointlabelfcolor +'</CssParameter>  </Fill></TextSymbolizer></Rule>';
	
	var pointlabelstylemax = ' <Rule>  <MaxScaleDenominator>'+ sldpointlabelmaxsdmntr +'</MaxScaleDenominator><PointSymbolizer>    <Graphic>      <Mark>        <WellKnownName>'+sldsymboltype+'</WellKnownName>        <Fill>  <CssParameter name="fill">'+sldpointsymbolfillcolor+'</CssParameter>          <CssParameter name="fill-opacity">'+sldpointsymbolfillopacity+'</CssParameter> </Fill>        <Stroke>          <CssParameter name="stroke">'+sldpointsymbolstrokecolor+'</CssParameter>          <CssParameter name="stroke-width">'+sldpointsymbolstrokewidth+'</CssParameter>        </Stroke>      </Mark>      <Size>'+sldpointsymbolsize+'</Size>    </Graphic>  </PointSymbolizer> <TextSymbolizer>  <Label>    <ogc:PropertyName>'+sldlabelname+'</ogc:PropertyName>  </Label>  <Font>     <CssParameter name="font-family">'+ sldpointlabelffamily +'</CssParameter> <CssParameter name="font-size">'+sldpointlabelminsdmntrsize+'</CssParameter>     <CssParameter name="font-style">'+sldpointlabelfstyle+'</CssParameter>     <CssParameter name="font-weight">'+sldpointlabelfweight +'</CssParameter>  </Font>   <LabelPlacement>    <PointPlacement>      <AnchorPoint>        <AnchorPointX>'+ sldpointlabelapx+'</AnchorPointX>      <AnchorPointY>'+ sldpointlabelapy +'</AnchorPointY> </AnchorPoint>       <Displacement>        <DisplacementX>'+sldpointlabelpdx+'</DisplacementX>        <DisplacementY>'+sldpointlabelpdy+'</DisplacementY>      </Displacement>      </PointPlacement>  </LabelPlacement>  <Fill>    <CssParameter name="fill">'+ sldpointlabelfcolor +'</CssParameter>  </Fill></TextSymbolizer></Rule>';
	var pointlabelstylemin = ' <Rule>  <MinScaleDenominator>'+ sldpointlabelminsdmntr +'</MinScaleDenominator><PointSymbolizer>    <Graphic>      <Mark>        <WellKnownName>'+sldsymboltype+'</WellKnownName>        <Fill>  <CssParameter name="fill">'+sldpointsymbolfillcolor+'</CssParameter>          <CssParameter name="fill-opacity">'+sldpointsymbolfillopacity+'</CssParameter> </Fill>        <Stroke>          <CssParameter name="stroke">'+sldpointsymbolstrokecolor+'</CssParameter>          <CssParameter name="stroke-width">'+sldpointsymbolstrokewidth+'</CssParameter>        </Stroke>      </Mark>      <Size>'+sldpointsymbolsize+'</Size>    </Graphic>  </PointSymbolizer> <TextSymbolizer>  <Label>    <ogc:PropertyName>'+sldlabelname+'</ogc:PropertyName>  </Label>  <Font>     <CssParameter name="font-family">'+ sldpointlabelffamily +'</CssParameter> <CssParameter name="font-size">'+sldpointlabelmaxsdmntrsize+'</CssParameter>     <CssParameter name="font-style">'+sldpointlabelfstyle+'</CssParameter>     <CssParameter name="font-weight">'+sldpointlabelfweight +'</CssParameter>  </Font>   <LabelPlacement>    <PointPlacement>      <AnchorPoint>        <AnchorPointX>'+ sldpointlabelapx+'</AnchorPointX>      <AnchorPointY>'+ sldpointlabelapy +'</AnchorPointY> </AnchorPoint>       <Displacement>        <DisplacementX>'+sldpointlabelpdx+'</DisplacementX>        <DisplacementY>'+sldpointlabelpdy+'</DisplacementY>      </Displacement>      </PointPlacement>  </LabelPlacement>  <Fill>    <CssParameter name="fill">'+ sldpointlabelfcolor +'</CssParameter>  </Fill></TextSymbolizer></Rule>';
	
	var pointsymbollabelsldcode = ""; 
	
	if($("#zoomenabled").is(':checked')){
		pointsymbollabelsldcode = pointlabelsldstart + pointlabelstylemax + pointlabelstylemin + pointlabelsldend;
	}
	   
	else{
		pointsymbollabelsldcode = pointlabelsldstart + pointlabelstyle + pointlabelsldend;
	
	}
	return pointsymbollabelsldcode;
	
}

function generatepointimglabelSLD(){
	
	var sldimagename = $("#sldpointimagename").val().split('\\')[2];
	var sldpointimagesize = $("#sldpointimagesize").val();
	var sldsymboltype = $("#sldpointsymbolstyle").val();
	var sldpointsymbolsize = $("#sldpointsymbolsize").val();
	var sldpointsymbolfillcolor = $("#sldpointsymbolfillcolor").val();
	var sldpointsymbolfillopacity = $("#sldpointsymbolfillcoloropacity").val();
	var sldpointsymbolstrokecolor = $("#sldpointsymbolstrokecolor").val();
	var sldpointsymbolstrokewidth = $("#sldpointsymbolstrokewidth").val();
	
	var sldlabelname = $("#sldpointpropertyname").val();
	var sldpointlabelfcolor = $("#sldpointfontcolor").val();
	var sldpointlabelffamily = $("#sldpointfontfamily").val();
	var sldpointlabelfsize = $("#sldpointfontsize").val();
	var sldpointlabelfstyle = $("#sldpointfontstyle").val();
	var sldpointlabelfweight = $("#sldpointfontweight").val();
	var sldpointlabelapx = $("#sldpointanchorpointx").val();
	var sldpointlabelapy = $("#sldpointanchorpointy").val();
	var sldpointlabelpdx = $("#sldpointdisplacementx").val();
	var sldpointlabelpdy = $("#sldpointdisplacementy").val();
	var sldpointlabelrotation = $("#sldpointlablerotation").val();
	var sldpointlabelminsdmntr = $("#sldpointminscalednmtr").val();
	var sldpointlabelmaxsdmntr = $("#sldpointmaxscalednmtr").val();
	var sldpointlabelminsdmntrsize = $("#sldpointminscalednmtrsize").val();
	var sldpointlabelmaxsdmntrsize = $("#sldpointmaxscalednmtrsize").val();
	
	var pointimglabelsldstart = '<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd">	  <NamedLayer><Name>Point</Name><UserStyle>  <Title>Point Style</Title><FeatureTypeStyle>';
	var pointimglabelsldend = '</FeatureTypeStyle></UserStyle></NamedLayer></StyledLayerDescriptor>';

	var pointimagelabelstyle = ' <Rule> <PointSymbolizer><Graphic>  <ExternalGraphic>    <OnlineResource      xlink:type="simple"      xlink:href="'+sldimagename+'" />    <Format>image/png</Format>  </ExternalGraphic>  <Size>'+sldpointimagesize+'</Size></Graphic></PointSymbolizer> <TextSymbolizer>  <Label>    <ogc:PropertyName>'+sldlabelname+'</ogc:PropertyName>  </Label>  <Font>     <CssParameter name="font-family">'+ sldpointlabelffamily +'</CssParameter> <CssParameter name="font-size">'+sldpointlabelfsize+'</CssParameter>     <CssParameter name="font-style">'+sldpointlabelfstyle+'</CssParameter>     <CssParameter name="font-weight">'+sldpointlabelfweight +'</CssParameter>  </Font>   <LabelPlacement>    <PointPlacement>      <AnchorPoint>        <AnchorPointX>'+ sldpointlabelapx+'</AnchorPointX>      <AnchorPointY>'+ sldpointlabelapy +'</AnchorPointY> </AnchorPoint>       <Displacement>        <DisplacementX>'+sldpointlabelpdx+'</DisplacementX>        <DisplacementY>'+sldpointlabelpdy+'</DisplacementY>      </Displacement>      </PointPlacement>  </LabelPlacement>  <Fill>    <CssParameter name="fill">'+ sldpointlabelfcolor +'</CssParameter>  </Fill></TextSymbolizer></Rule>';
	
	var pointimagelabelstylemax = ' <Rule>  <MaxScaleDenominator>'+ sldpointlabelmaxsdmntr +'</MaxScaleDenominator> <PointSymbolizer><Graphic>  <ExternalGraphic>    <OnlineResource      xlink:type="simple"      xlink:href="'+sldimagename+'" />    <Format>image/png</Format>  </ExternalGraphic>  <Size>'+sldpointimagesize+'</Size></Graphic></PointSymbolizer> <TextSymbolizer>  <Label>    <ogc:PropertyName>'+sldlabelname+'</ogc:PropertyName>  </Label>  <Font>     <CssParameter name="font-family">'+ sldpointlabelffamily +'</CssParameter> <CssParameter name="font-size">'+sldpointlabelminsdmntrsize+'</CssParameter>     <CssParameter name="font-style">'+sldpointlabelfstyle+'</CssParameter>     <CssParameter name="font-weight">'+sldpointlabelfweight +'</CssParameter>  </Font>   <LabelPlacement>    <PointPlacement>      <AnchorPoint>        <AnchorPointX>'+ sldpointlabelapx+'</AnchorPointX>      <AnchorPointY>'+ sldpointlabelapy +'</AnchorPointY> </AnchorPoint>       <Displacement>        <DisplacementX>'+sldpointlabelpdx+'</DisplacementX>        <DisplacementY>'+sldpointlabelpdy+'</DisplacementY>      </Displacement>      </PointPlacement>  </LabelPlacement>  <Fill>    <CssParameter name="fill">'+ sldpointlabelfcolor +'</CssParameter>  </Fill></TextSymbolizer></Rule>';
	var pointimagelabelstylemin = ' <Rule>  <MinScaleDenominator>'+ sldpointlabelminsdmntr +'</MinScaleDenominator> <PointSymbolizer><Graphic>  <ExternalGraphic>    <OnlineResource      xlink:type="simple"      xlink:href="'+sldimagename+'" />    <Format>image/png</Format>  </ExternalGraphic>  <Size>'+sldpointimagesize+'</Size></Graphic></PointSymbolizer> <TextSymbolizer>  <Label>    <ogc:PropertyName>'+sldlabelname+'</ogc:PropertyName>  </Label>  <Font>     <CssParameter name="font-family">'+ sldpointlabelffamily +'</CssParameter> <CssParameter name="font-size">'+sldpointlabelmaxsdmntrsize+'</CssParameter>     <CssParameter name="font-style">'+sldpointlabelfstyle+'</CssParameter>     <CssParameter name="font-weight">'+sldpointlabelfweight +'</CssParameter>  </Font>   <LabelPlacement>    <PointPlacement>      <AnchorPoint>        <AnchorPointX>'+ sldpointlabelapx+'</AnchorPointX>      <AnchorPointY>'+ sldpointlabelapy +'</AnchorPointY> </AnchorPoint>       <Displacement>        <DisplacementX>'+sldpointlabelpdx+'</DisplacementX>        <DisplacementY>'+sldpointlabelpdy+'</DisplacementY>      </Displacement>      </PointPlacement>  </LabelPlacement>  <Fill>    <CssParameter name="fill">'+ sldpointlabelfcolor +'</CssParameter>  </Fill></TextSymbolizer></Rule>';
	
	var pointimagelabelsldcode = ""; 
	
	if($("#zoomenabled").is(':checked')){
		pointimagelabelsldcode = pointimglabelsldstart + pointimagelabelstylemax + pointimagelabelstylemin + pointimglabelsldend;
	}
	   
	else{
		pointimagelabelsldcode = pointimglabelsldstart + pointimagelabelstyle + pointimglabelsldend;
	
	}
	return pointimagelabelsldcode;
}

var sldlayersource;
var sldlayervector;
var frontmap2;
var featureProperties;
var sldwmslayer;
var sldwfslayer;
var sldlayercount = 0 ;

function layerPreview2(workspace,url,layername) {
	
		var url2 = url + '/';
		var workspacelayer = workspace + ":" + layername;
		var webMapServiceUrl = url2 + workspace + '/wms'; // Web map service URL
		var basemapProjection = 'EPSG:4326';
		var latitude = '73.8611';
		var longitude = '18.6378';
		
		if (sldlayercount == 1) {
			frontmap2.removeLayer(sldwmslayer);
			sldlayercount = 0;
		}
		
		sldwmslayer = new ol.layer.Tile({
			title : workspacelayer,
			visible : true,
			source : new ol.source.TileWMS({
				url : webMapServiceUrl,
				params : {
					'LAYERS' : workspacelayer
				},
				serverType : 'geoserver'
			})
		});

		// Float Conversion of Coordinates 
		var lat = parseFloat(latitude);
		var lon = parseFloat(longitude);

		// Projection view specifications 
		var startView = new ol.View({
			center : ol.proj.transform([ lat, lon ], basemapProjection,'EPSG:3857'),
			zoom : 8
		});
		
		sldlayersource = new ol.source.Vector(
				{
					format : new ol.format.GeoJSON(),
					url : function(extent, resolution, projection) {
						return url+'/ows?service=WFS&version=1.0.0&request=GetFeature&typeName='+workspace+':'+layername+'&outputFormat=application/json&srsname=EPSG:3857&bbox=' + extent.join(',') + ',EPSG:3857';
					},
					strategy : ol.loadingstrategy.tile(ol.tilegrid.createXYZ({
						maxZoom : 19
					}))
				});
		
		var defaultstyle2 = new ol.style.Style({
			fill : new ol.style.Fill({
				color : "transparent",		
			}),
			stroke : new ol.style.Stroke({
				color :  "transparent",
				width : 2
			}),
			image : new ol.style.Circle({   // Circle radius and fill colors for point
				radius : 5,
				fill : new ol.style.Fill({
					color :  "transparent"
				}),
				stroke : new ol.style.Stroke({
					color :  "transparent",
					width : 2
				})
			})
		});
		
		sldlayervector = new ol.layer.Vector({
			
			source : sldlayersource,
			style: defaultstyle2
				
		});
		
	
		if (sldlayercount == 0) {
			frontmap2 = new ol.Map({
				target : 'frontmap2',
				layers : [ sldwmslayer ], // Add base map first
				view : startView
			});
			sldlayercount = 1;
		} else {

		}
			
		frontmap2.addLayer(sldlayervector);		
	}
function getproperties(){
	var appendData = "";
	$("#sldpointpropertyname").empty();
	var featureProperties = frontmap2.getLayers().getArray()[1].getSource().getFeatures()[0].getProperties();
	for (prop in featureProperties) {
		if (prop == "geometry") {
		} else {
			appendData += "<option value = '" + prop + "'>"	+prop +" </option>";
			$('#sldpointpropertyname').html(appendData);
		}
	}
}

function publishReset(){
	$(".resetVal").val("");
	$("#idsrs").val("0");
	$("#defaultStyle").val("0");
}