
/*

MIT License

Copyright (c) 2020 Andrei Maksimovich 

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/

var defaultExportPath = Folder.desktop.fullName + "/Export/";
try {
    defaultExportPath = app.activeDocument.path + "/" + app.activeDocument.name.substring(0, app.activeDocument.name.length-4) + ".Export/";
} catch (e) {}

var defaultExportFileNamePrefix = app.activeDocument.name;
if (defaultExportFileNamePrefix.indexOf(".psd", 0)!=0) {
    defaultExportFileNamePrefix = defaultExportFileNamePrefix.substring(0, defaultExportFileNamePrefix.length-4) 
}

var exportConfiguration = {
    exportOnlyVisible: true,
    trimLayers: true,
    exportFileNamePrefix: defaultExportFileNamePrefix + "_",
    layerNameIncludePrefix: "",
    layerNameIncludePostfix: "",
    layerNameExcludePrefix: "*",
    layerNameExcludePostfix: "",
    exportPath: defaultExportPath
}

var layersForExport = [];

function main() {

    var dlg = new Window("dialog", "Export layers To PNGs");

    dlg.orientation = "column";
    dlg.alignment = "left";

    // ---- Configuration
    var configurationPanel = dlg.add("panel", undefined, "Configuration");
    configurationPanel.orientation = "column";
    configurationPanel.alignment = "left";

    var exportTrimLayersCheckbox = configurationPanel.add('checkbox', undefined, "Trim layers");
    exportTrimLayersCheckbox.value = exportConfiguration.trimLayers;

    // ---- Layers
    var layersPanel = dlg.add("panel", undefined, "Inlude/Exclude layers");
    layersPanel.orientation = "column";
    layersPanel.alignment = "left";

    // Export Configuration Group
    var exportConfigurationGroup = layersPanel.add("group", undefined);
    exportConfigurationGroup.orientation = "row";
    exportConfigurationGroup.alignment = "left";

    var exportOnlyVisibleLayersCheckbox = exportConfigurationGroup.add('checkbox', undefined, "Export only visible layers");
    exportOnlyVisibleLayersCheckbox.value = exportConfiguration.exportOnlyVisible;

    // Layer name include prefix
    var layerNameIncludePrefixGroup = layersPanel.add("group", undefined);
    layerNameIncludePrefixGroup.orientation = "row";
    layerNameIncludePrefixGroup.alignment = "left";
    layerNameIncludePrefixGroup.add('statictext', undefined, "Layer name include prefix  ");
    var layerNameIncludPrefixEditText = layerNameIncludePrefixGroup.add('edittext', undefined, exportConfiguration.layerNameIncludePrefix);
    layerNameIncludPrefixEditText.characters = 20;

    // Layer name include postfix
    var layerNameIncludePostfixGroup = layersPanel.add("group", undefined);
    layerNameIncludePostfixGroup.orientation = "row";
    layerNameIncludePostfixGroup.alignment = "left";
    layerNameIncludePostfixGroup.add('statictext', undefined, "Layer name include postfix");
    var layerNameIncludePostfixEditText = layerNameIncludePostfixGroup.add('edittext', undefined, exportConfiguration.layerNameIncludePostfix);
    layerNameIncludePostfixEditText.characters = 20;
    
    // Layer name exclude prefix
    var layerNameExcludePrefixGroup = layersPanel.add("group", undefined);
    layerNameExcludePrefixGroup.orientation = "row";
    layerNameExcludePrefixGroup.alignment = "left";
    layerNameExcludePrefixGroup.add('statictext', undefined, "Layer name exclude prefix  ");
    var layerNameExcludePrefixEditText = layerNameExcludePrefixGroup.add('edittext', undefined, exportConfiguration.layerNameExcludePrefix);
    layerNameExcludePrefixEditText.characters = 20;

    // Layer name exclude posfix
    var layerNameExcludePostfixGroup = layersPanel.add("group", undefined);
    layerNameExcludePostfixGroup.orientation = "row";
    layerNameExcludePostfixGroup.alignment = "left";
    layerNameExcludePostfixGroup.add('statictext', undefined, "Layer name exclude postfix");
    var layerNameExcludePostfixEditText = layerNameExcludePostfixGroup.add('edittext', undefined, exportConfiguration.layerNameExcludePostfix);
    layerNameExcludePostfixEditText.characters = 20;

    // ---- Export File Name Prefix
    var exportPathParametersPanel = dlg.add("panel", undefined, "Export path");
    exportPathParametersPanel.orientation = "column";
    exportPathParametersPanel.alignment = "left";

    //  Export File Name Prefix
    var exportFileNamePrefixGroup = exportPathParametersPanel.add("group", undefined);
    exportFileNamePrefixGroup.orientation = "row";
    exportFileNamePrefixGroup.alignment = "left";

    exportFileNamePrefixGroup.add('statictext', undefined, "Export file name prefix");
    var exportFileNamePrefixEditText = exportFileNamePrefixGroup.add("edittext", undefined, exportConfiguration.exportFileNamePrefix);
    exportFileNamePrefixEditText.characters = 20;


    //  Export Path
    var exportPathGroup = exportPathParametersPanel.add("group", undefined);
    exportPathGroup.orientation = "row";
    exportPathGroup.alignment = "left";

    exportPathGroup.add('statictext', undefined, "Export path");
    var exportPathEditText = exportPathGroup.add("edittext", undefined, exportConfiguration.exportPath);
    exportPathEditText.characters = 20;
    var exportPathBrowseButton = exportPathGroup.add("button", undefined, "Browse");
    exportPathBrowseButton.onClick = function() {
        var folder = Folder.selectDialog("Select folder for export");
        if (folder!=null) exportPathEditText.text = folder.fullName;
    };

    // ---- Ok / Cancel buttons

    var dlgButtonGroup = dlg.add('group', undefined);
    dlgButtonGroup.orientation = 'row';
    dlgButtonGroup.alignment = 'center';

    var btnOK = dlgButtonGroup.add('button', undefined, "    OK    ");
    btnOK.characters = 10;
    var btnCancel = dlgButtonGroup.add('button', undefined, " Cancel ");
    btnCancel.characters = 10;

    btnCancel.onClick = function() {
        dlg.close();
    };

    btnOK.onClick = function() {
        exportConfiguration.exportOnlyVisible = exportOnlyVisibleLayersCheckbox.value;
        exportConfiguration.trimLayers = exportTrimLayersCheckbox.value;
        exportConfiguration.layerNameIncludePrefix = layerNameIncludPrefixEditText.text;
        exportConfiguration.layerNameIncludePostfix = layerNameIncludePostfixEditText.text;
        exportConfiguration.layerNameExcludePrefix = layerNameExcludePrefixEditText.text;
        exportConfiguration.layerNameExcludePostfix = layerNameIncludePostfixEditText.text;
        exportConfiguration.exportFileNamePrefix = exportFileNamePrefixEditText.text;
        exportConfiguration.exportPath = exportPathEditText.text;
        exportLayers();
        dlg.close();
    }

    dlg.show();

}

function exportLayers() {

    getLayersForExport();

    var exportFolder = new Folder(exportConfiguration.exportPath);
    if (!exportFolder.exists) {
        exportFolder.create();
    }

    var mainDocument = app.activeDocument;
    var exportFolderPath = exportFolder.fullName + "/";
    
    for (var i = 0; i<layersForExport.length; i++) {

        var layer = layersForExport[i];

        var dstDocument = app.documents.add(mainDocument.width, mainDocument.height, mainDocument.resolution, exportConfiguration.exportFileNamePrefix + layer.name, NewDocumentMode.RGB, DocumentFill.TRANSPARENT, mainDocument.pixelAspectRatio, mainDocument.bitsPerChannel, mainDocument.colorProfileName);
        app.activeDocument = mainDocument;
        layer.duplicate(dstDocument, ElementPlacement.PLACEATEND);
        app.activeDocument = dstDocument;
        dstDocument.layers[0].remove();
        if (!dstDocument.layers[0].visible) dstDocument.layers[0].visible = true;
        if (exportConfiguration.trimLayers) dstDocument.trim(TrimType.TRANSPARENT, true, true, true, true);

        var saveFile = new File(exportFolderPath + exportConfiguration.exportFileNamePrefix + layer.name + ".png");
        var saveOptions = new PNGSaveOptions();
        saveOptions.compression = 9;

        dstDocument.saveAs(saveFile, saveOptions);
        dstDocument.close(SaveOptions.DONOTSAVECHANGES);

    }

}

function isLayerValidForExport(layer) {

    if (layer.toString().indexOf("LayerSet")==1) return false;

    var name = layer.name;

    if (exportConfiguration.exportOnlyVisible && !layer.visible) return false;

    if (exportConfiguration.layerNameIncludePrefix!='') {
        if (name.indexOf(exportConfiguration.layerNameIncludePrefix, 0)!=0) return false;
    }

    if (exportConfiguration.layerNameIncludePostfix!='') {
        if (name.lastIndexOf(exportConfiguration.layerNameIncludePostfix)!=name.length-exportConfiguration.layerNameIncludePostfix.length) return false;
    }

    if (exportConfiguration.layerNameExcludePrefix!='') {
        if (name.indexOf(exportConfiguration.layerNameExcludePrefix, 0)==0) return false;
    }

    if (exportConfiguration.layerNameExcludePostfix!='') {
        if (name.lastIndexOf(exportConfiguration.layerNameExcludePostfix)==name.length-exportConfiguration.layerNameExcludePostfix.length) return false;
    }

    return true;
}

function getLayersForExport() {
    var layers = app.activeDocument.layers;
    var layersSets = app.activeDocument.layerSets;
    for (var i = 0; i < layers.length; i++) {
        getLayersForExportLayers(layers[i]);

    }
    for (var i = 0; i<layersSets.length; i++) {
        getLayersForExportLayersSet(layersSets[i]);
    }
}

function getLayersForExportLayers(layer) {
    if (isLayerValidForExport(layer)) layersForExport.push(layer);
}

function getLayersForExportLayersSet(layersSet) {
    for (var j=0; j<layersSet.layerSets.length; j++) {
        getLayersForExportLayersSet(layersSet.layerSets[j]);
    }
    for (var j=0; j<layersSet.layers.length; j++) {
        getLayersForExportLayers(layersSet.layers[j]);
    }
}


main();

