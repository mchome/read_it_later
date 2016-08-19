var store = new Vue({
    el: '#app',
    data: {
        listname: '',
        currenttabs: [],
        savedlist: []
    },
    methods: {
        loadCurrenttabs: function() {
            chrome.tabs.query({}, function(tabs) {
                for (let tab of tabs) {
                    store.$data.currenttabs.push({ 'title': tab.title, 'url': tab.url, 'favimg': tab.favIconUrl, 'index': tab.index });
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
            if (this.listname !== '') {
                let item = {};
                item[this.listname] = JSON.stringify(this.currenttabs);
                chrome.storage.local.set(item);
                this.savedlist.push({ listname: this.listname, tabs: this.currenttabs });
            }
        },
        removeTabs: function(index) {
            chrome.storage.local.remove(this.savedlist[index].listname);
            this.savedlist.splice(index, 1);
        },
        openTab: function(url) {
            chrome.tabs.create({ url: url });
        },
        defaultListname: function() {
            let currentdate = new Date();
            let datetime = currentdate.getFullYear() + "/" + (currentdate.getMonth() + 1) + "/" + currentdate.getDate() + " " + currentdate.getHours() + ":" + currentdate.getMinutes() + ":" + currentdate.getSeconds();
            this.listname = datetime;
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