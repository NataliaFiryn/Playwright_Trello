const { test, expect, request } = require('@playwright/test')
const { APIUtils } = require('../tests/utils/APIUtils')
const { WorkspacePage } = require('../pageobjects/workspace')

test.describe('Only API Tests', () => {

    test('All API request', async () => {
        const apiContext = await request.newContext()
        const apiRequest = new APIUtils(apiContext)
        await apiRequest.createBoard('First Board')
        await apiRequest.createList('TODO')
        await apiRequest.createCard('Task')
        await apiRequest.getExistingListId(1)
        await apiRequest.moveCardFromCreatedListToExistingList()
        await apiRequest.deleteCard()
        await apiRequest.deleteBoard()
        await apiRequest.deleteAllBoards()
    });
});
test.describe('API tests with verification on UI', () => {
    test.beforeEach(async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.login()
    });
    test('Create Board', async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.addBoardByAPICheckOnUI('First Board')
    });
    test('Create List', async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.addListByAPICheckOnUI('Second Board', 'New List')
    });
    test('Create Card', async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.addCartByAPICheckOnUI('Third Board', 'New List', 'New Card')
    });
    test('Move Card', async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.moveCartByAPICheckOnUI('Fourth Board', 'New List', 'New Card', 2)
    });
    test('Delete Card', async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.deleteCartByAPICheckOnUI('Fifth Board', 'New List', 'New Card')
    });
    test('Delete Board', async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.deleteBoardByAPICheckOnUI('Sixth Board')
    });
    test('Delete All Boards', async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.deleteAllBoardByAPICheckOnUI()
    });
});