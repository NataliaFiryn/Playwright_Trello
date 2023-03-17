const { test, expect, request } = require('@playwright/test')
const { APIUtils } = require('../tests/utils/APIUtils')
const { PageObjectsManager } = require('../pageobjects/pageObjectsManager')

test.describe('Only API Tests', () => {

    test('All API request', async ({request}) => {
        const apiRequest = new APIUtils(request)
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
