var store = new Vue({
    el: '#app',
    data: {
        defaultlistname: '',
        listname: '',
        currenttabs: [],
        savedlist: []
    },
    methods: {
        loadCurrenttabs: function() {
            chrome.tabs.query({}, function(tabs) {
                for (let tab of tabs) {
                    if (tab.favIconUrl === '' || tab.favIconUrl === 'chrome://theme/IDR_EXTENSIONS_FAVICON@2x' || !tab.favIconUrl) {
                        store.$data.currenttabs.push({ 'title': tab.title, 'url': tab.url, 'favimg': '/static/images/website.png', 'index': tab.index });
                    } else {
                        store.$data.currenttabs.push({ 'title': tab.title, 'url': tab.url, 'favimg': tab.favIconUrl, 'index': tab.index });
                    }
                }
            });
        },
        loadTabs: function() {
            chrome.storage.local.get(null, function(items) {
                let allkeys = Object.keys(items);
                if (allkeys !== 0) {
                    for (let key of allkeys) {
                        store.$data.savedlist.push({ listname: key, tabs: JSON.parse(items[key]) });
                    }
                }
            });
        },
        saveTabs: function() {
            if (this.listname === '') {
                this.listname = this.defaultlistname;
            }
            let item = {};
            item[this.listname] = JSON.stringify(this.currenttabs);
            chrome.storage.local.set(item);
            this.savedlist.push({ listname: this.listname, tabs: this.currenttabs });
        },
        removeTabs: function(index) {
            chrome.storage.local.remove(this.savedlist[index].listname);
            this.savedlist.splice(index, 1);
        },
        openTab: function(url) {
            chrome.tabs.create({ url: url });
        },
        openMultitab: function(tabs) {
            for (let tab of tabs) {
                chrome.tabs.create({ url: tab.url });
            }
        },
        defaultListname: function() {
            let currentdate = new Date();
            let datetime = currentdate.getFullYear() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            this.defaultlistname = datetime;
        }
    },
    ready: function() {
        this.loadCurrenttabs();
        this.loadTabs();
        this.defaultListname();
    }
})

// chrome extension storage:
// key: listname
// value: serialized tabs
//
// savedlist:
// {
//     listname: listname,
//     tabs: {
//         title: title,
//         url: url,
//         favimg: favIconUrl,
//         index: index
//     }
// }