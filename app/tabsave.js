'use strict';

function saveTabs(name, tabs) {
    let items = {};
    let savetabs = {};
    tabs.forEach(function(tab) {
        savetabs = add2json(savetabs, tab.favIconUrl, tab.url);
    })
    items[name] = savetabs;
    chrome.storage.local.set(items);
}

function loadTabs() {
    chrome.storage.local.get(null, function(items) {
        let allkeys = Object.keys(items);
        if (allkeys.length !== 0) {
            loadJson(allkeys);
        }
        else {
            $('#list').hide();
        }
    })
}

function loadJson(keys) {
    chrome.storage.local.get(keys, function(results) {
        $.each(results, function(name, result) {
            let uuid = generateUUID();
            $('#list').prepend('<div class="col-md-12" id="' + uuid + '"></div>')
            $('#' + uuid).append('<div id="savedtabs' + uuid + '"></div><div id="favimgsaved' + uuid + '"></div>')
            $.each(result, function(url, favimg) {
                setFavimgSaved(name, favimg, url, uuid);
            })
            $('#delpages' + uuid).on("click", function() { delTabs(name); });
            $('#loadpages' + uuid).on("click", function() { delTabs(name); });
        })
    })
}

function add2json(savetabs, favimg, url) {
    savetabs[url] = favimg;
    return savetabs
}

function delTabs(name) {
    if (name === "") {
        return
    }
    chrome.storage.local.remove(name);
}

function cleanTabs() {
    chrome.storage.local.clear(function() {
        $('#list').hide();
    })
}


$('#savebtn').click(function() {
    chrome.tabs.query({}, function(tabs) {
        let name = $('#name').val();
        if (name === "") {
            name = $('#name').attr('placeholder')
        }
        saveTabs(name, tabs);
    })
})

loadTabs()
