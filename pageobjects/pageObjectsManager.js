const { WorkspacePage } = require('./workspacePage')
const { BoardPage } = require('./boardPage')
class PageObjectsManager {
    constructor(page) {
        this.page = page
        this.workspacePage = new WorkspacePage(this.page)
        this.boardPage = new BoardPage(this.page)
    }

    getWorkspacePage() {
        return this.workspacePage
    }
    getBoardPage() {
        return this.boardPage
    }
}
module.exports = { PageObjectsManager };