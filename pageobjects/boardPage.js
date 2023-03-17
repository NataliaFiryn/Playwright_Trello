const { expect } = require('@playwright/test');

class BoardPage {
    constructor(page) {
        this.page = page;
        this.addNewList = this.page.locator('.js-add-list')
        this.listNameField = this.page.locator('.list-name-input')
        this.addListButton = this.page.locator('[value="Add list"]')
        this.allListsHeaders = this.page.locator('.list-header')
        this.allAddCartButtons = this.page.locator('.js-add-a-card')
        this.cartNameField = this.page.locator('.list-card-composer-textarea')
        this.addCartButton = this.page.locator('[value="Add card"]')
        this.cart = this.page.locator('.list-cards .js-member-droppable')
        this.moveCartButton = this.page.locator('.js-move-card')
        this.moveToListField = this.page.locator('.pop-over .js-select-list')
        this.moveButton = this.page.locator('.pop-over [value="Move"]')
        this.cartPosition = this.page.locator('.js-open-move-from-header')
        this.archiveCartButton = this.page.locator('.js-archive-card')
        this.deleteCartButton = this.page.locator('.js-delete-card')
        this.submitActionButton = this.page.locator('.pop-over-content input')
        this.boardMenu = this.page.locator('.board-header [aria-label="Show menu"]')
        this.boardLinkField = this.page.locator('#id-short-url')
        this.moreMenuOptionsButton = this.page.locator('.js-open-more')
        this.allBoards = this.page.locator('.board-tile-details')
        this.closeBoardButton = this.page.locator('[class="board-menu-navigation-item-link js-close-board"]')
        this.deleteBoardButton = this.page.locator('[data-testid="close-board-delete-board-button"]')
        this.deleteBoardConfirmButton = this.page.locator('[data-testid="close-board-delete-board-confirm-button"]')
    }
    async createList(listName) {
        await this.addNewList.click()
        await this.listNameField.type(listName)
        await this.addListButton.click()
        expect((await this.allListsHeaders).last()).toContainText(listName)
    }
    async createCart(cartName) {
        expect(await this.allListsHeaders).toHaveCount(4)
        await this.allAddCartButtons.last().click()
        await this.cartNameField.type(cartName)
        await this.addCartButton.click()
        expect(await this.cart).toHaveJSProperty('outerText', cartName)
    }
    async moveCart(moveToListName) {
        await this.cart.click()
        await this.moveCartButton.click()
        await this.moveToListField.selectOption(moveToListName)
        await this.moveButton.click()
        expect(await this.cartPosition).toHaveText(moveToListName)
    }
    async deleteCart() {
        expect(await this.cart).toHaveCount(1)
        await this.cart.click()
        await this.archiveCartButton.click()
        await this.deleteCartButton.click()
        await this.submitActionButton.click()
        expect(await this.cart).toHaveCount(0)
    }
    async deleteBoard() {
        await this.boardMenu.click()
        await this.moreMenuOptionsButton.click()
        const shorturl = await this.boardLinkField.getAttribute('value')
        this.boardUrl = (shorturl).split('com')[1]
        await this.closeBoardButton.click()
        await this.submitActionButton.click()
        await this.deleteBoardButton.click()
        await this.deleteBoardConfirmButton.click()
        expect(await this.page.locator('[href="' + this.boardUrl + '"]')).toHaveCount(0)
    }
    async deleteAllBoards() {
        await this.page.waitForSelector(this.allBoards._selector)
        const numberOfBoards = await this.allBoards.count()
        for (let i = 0; i < numberOfBoards; i++) {
            await this.allBoards.nth(0).click()
            await this.deleteBoard()
            expect(await this.allBoards).toHaveCount(0)
        }
    }
}
module.exports = { BoardPage }; 