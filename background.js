browser.contextMenus.create({
    id: "rohlik-wishlist-menuitem",
    title: "Rohlik wishes",
    contexts: ["link"],
});
// documentUrlPatterns: ['*://*.rohlik.cz/*']
// targetUrlPatterns: ['*://*.rohlik.cz/*']

browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId === "rohlik-wishlist-menuitem") {
        const jinfo = JSON.stringify(info)
        const script = `window.wishClick('${jinfo}')`
        await browser.tabs.executeScript(tab.id, {code: script})
    }
});

browser.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (changeInfo.status == "complete") {
        browser.tabs.sendMessage(tabId, 'tabUpdateFinished')
    }
})