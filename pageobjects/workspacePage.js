const { expect, request } = require('@playwright/test');

class WorkspacePage {
    constructor(page) {
        this.page = page;
        this.LOGIN = process.env.LOGIN
        this.PASSWORD = process.env.PASSWORD
        this.loginEmail = page.locator('#user')
        this.continueButton = page.locator('#login')
        this.loginPassword = page.locator('#password')
        this.loginButton = page.locator('#login-submit')
        this.createNewBoard = this.page.locator('[data-testid="create-board-tile"]')
        this.boardTitleField = this.page.locator('[data-testid="create-board-title-input"]')
        this.boardColorPicker = this.page.locator('#background-picker')
        this.boardVisibility = this.page.locator('[id*="create-board-select-visibility"]')
        this.makeBoardPublicButton = this.page.locator('.rX4pAv5sWHFNjp .OOBSPOaalMGJXJ button')
        this.createBoardButton = this.page.locator('[data-testid="create-board-submit-button"]')
        this.allBoards = this.page.locator('.boards-page-board-section-list .board-tile-details')
        this.allYourBoardsList = this.page.locator('.mlpxvZU4v4cMQN.qUkRGnTnJDff85')
        this.emptyBoardsList = this.page.locator('[data-testid="boards-list-empty-state"]')

    }
    async login() {
        await this.page.goto('https://trello.com/login')
        await this.loginEmail.type(this.LOGIN)
        await this.continueButton.click()
        await this.loginPassword.waitFor()
        await this.loginPassword.type(this.PASSWORD)
        await this.loginButton.click()
    }
    async createBoard(boardName, boardColor, boardVisibility) {
        await this.createNewBoard.click()
        await this.boardTitleField.type(boardName)
        await this.boardColorPicker.locator('[title=' + boardColor + ']').click()
        if (boardVisibility !== 'Workspace') await this.boardVisibility.click()
        if (boardVisibility === 'Public') {
            await this.page.getByRole('listitem').filter({ hasText: 'Public' }).click()
            await this.makeBoardPublicButton.click()
        } else if (boardVisibility === 'Private') {
            await this.page.getByRole('listitem').filter({ hasText: 'Private' }).click()
        }
        await this.createBoardButton.click()
    }
    async goToBoard(boardUrl) {
        await this.page.locator('[href="' + boardUrl + '"]').click()
    }
}
module.exports = { WorkspacePage }; 