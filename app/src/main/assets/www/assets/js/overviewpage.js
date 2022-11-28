$(document).ready(function(){ 
     
  console.log("Overview fired");

  var vmetadataTitle = localStorage.getItem('datasetname');
var metadataURL = "http://14.142.106.205:8080/geonetwork/srv/eng/q?title="+vmetadataTitle+"&from=1&to=20&resultType=details&fast=index&_content_type=json";
  
  $.get(metadataURL,function (data, status) {
      console.log("json fired");

      var metadata_link = data.metadata['link'].split('|');       
      var m_wmsurl = metadata_link[2];

      var vmetadata_abstract = data.metadata['abstract'];
      var vmetadata_topicCat = data.metadata['topicCat'];
      var vmetadata_language = data.metadata['mdLanguage'];
 
      var imageArr = data.metadata['image'].split('|')
      ////////////
      var vmetadata_imgsrc = imageArr[1].replace('localhost','14.142.106.205');
      ////////// 

      //Originator
      var vresponsibleParty = data.metadata['responsibleParty'][0];
      var vresponsiblePartyArr = vresponsibleParty.split('|');
      var vOrgRes = vresponsiblePartyArr[2];
      var vOrgName = vresponsiblePartyArr[5];


      //Status
      var vmetadata_status = data.metadata['status'];

      //language
      var vmetadata_language = data.metadata['mdLanguage'];
     

      //update frequency
      var m_updateFrequency = data.metadata['updateFrequency'];

      //Representation Type
      var m_SpatialType = data.metadata['spatialRepresentationType_text'];


      //Scale
      var m_scale = data.metadata['denominator'];

      //CRS
      var m_crs = data.metadata['crs'];

      //metadata language
      var m_mdLanguage = data.metadata['mdLanguage'];

      //source
      var m_identifier = data.metadata['geonet:info'].uuid; 

      //Extent
      var m_datasetExt = data.metadata.geoBox.split('|');
      //var m_datasetExt = data.metadata.geoBox[0].split('|');

      //Period
      var m_tempExtentBegin = data.metadata['tempExtentBegin'].split('t')[0];

      var m_tempExtentEnd = data.metadata['tempExtentEnd'].split('t')[0];

      //other keywords
      var m_otherkeywords = data.metadata['keywordGroup'].otherKeywords[0].value; 


      document.getElementById("m_imgsrvid").src = vmetadata_imgsrc;  
      document.getElementById("Overview_titleId").innerText=vmetadataTitle;
      document.getElementById("Overview_abstractId").innerText=vmetadata_abstract;
      document.getElementById("Overview_wmsTitleId").innerText=vmetadataTitle;

      var vTextVal = document.getElementById("Overview_wmsDesId").innerText;
      Overview_wmsDesId_cont =  " " + m_wmsurl + " with layer name " +  vmetadataTitle;

      vTextVal = vTextVal + Overview_wmsDesId_cont;
      document.getElementById("Overview_wmsDesId").innerText = vTextVal;

      document.getElementById("Overview_CatId").innerText = vmetadata_topicCat;
      document.getElementById("Overview_LanguageId").innerText = vmetadata_language;

      document.getElementById("Overview_crId").innerText = vOrgRes;
      document.getElementById("Overview_nameId").innerText = vOrgName;

      document.getElementById("Overview_StatusId").innerText = vmetadata_status;
      document.getElementById("updateFrequency_id").innerText = m_updateFrequency;

      document.getElementById("datatype_id").innerText = m_SpatialType;


      document.getElementById("m_scaleId").innerText = m_scale;

      document.getElementById("crs_id").innerText = m_crs;

      document.getElementById("m_languageId").innerText = m_mdLanguage; 

      document.getElementById("m_identifierId").innerText = m_identifier; 

      
      document.getElementById("m_xminId").innerText = m_datasetExt[0];
      document.getElementById("m_yminId").innerText = m_datasetExt[1];
      document.getElementById("m_xmaxId").innerText = m_datasetExt[2];
      document.getElementById("m_ymaxId").innerText = m_datasetExt[3]; 

      

      document.getElementById("m_stPeriodId").innerText = m_tempExtentBegin;  

      document.getElementById("m_endPeriodId").innerText = m_tempExtentEnd;  

      document.getElementById("m_otherkeywordId").innerText = m_otherkeywords; 
      
  });
   
    
});
