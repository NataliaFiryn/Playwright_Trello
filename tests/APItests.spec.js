const { test, expect, request } = require('@playwright/test')
const { APIUtils } = require('./utils/APIUtils')

test.describe('APITests', () => {

    test('All API REQESTS', async ({ page }) => {
        const apiContext = await request.newContext()
        const apiRequest = new APIUtils(apiContext)
        await apiRequest.createBoard('First Board')
        await apiRequest.createList('TODO')
        await apiRequest.createCard('Task')
        await apiRequest.getExistingListId(1)
        await apiRequest.moveCardFromCreatedListToExistingList()
        await apiRequest.deleteCard()
        await apiRequest.deleteBoard()
        //await apiRequest.deleteAllBoards()
    });
});