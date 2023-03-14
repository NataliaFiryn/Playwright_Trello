const { test, expect, request } = require('@playwright/test')
const { APIUtils } = require('../tests/utils/APIUtils')
const { WorkspacePage } = require ('../pageobjects/workspace')

test.describe('APITests', () => {

    test('All API REQESTS', async () => {
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
    test('Create Board', async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.login()
        await workspace.addBoardByAPICheckOnUI('First Board')
    });
    test('Create List', async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.login()
        await workspace.addListByAPICheckOnUI('Second Board','New List')
    });
    test('Create Card', async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.login()
        await workspace.addCartByAPICheckOnUI('Third Board','New List','New Card')
    });
    test('Delete Card', async ({ page }) => {
        const workspace = new WorkspacePage(page)
        await workspace.login()
        await workspace.deleteCartByAPICheckOnUI('Fourth Board','New List','New Card')
    });
});