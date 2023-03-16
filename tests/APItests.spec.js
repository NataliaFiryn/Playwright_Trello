const { test, expect, request } = require('@playwright/test')
const { APIUtils } = require('../tests/utils/APIUtils')
const { UIValidationsforAPI } = require('../pageobjects/UIValidationsforAPI')

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
        const uiValidation = new UIValidationsforAPI(page)
        await uiValidation.login()
    });
    test('Create Board', async ({ page }) => {
        const uiValidation = new UIValidationsforAPI(page)
        await uiValidation.addBoardByAPICheckOnUI('First Board')
    });
    test('Create List', async ({ page }) => {
        const uiValidation = new UIValidationsforAPI(page)
        await uiValidation.addListByAPICheckOnUI('Second Board', 'New List')
    });
    test('Create Card', async ({ page }) => {
        const uiValidation = new UIValidationsforAPI(page)
        await uiValidation.addCartByAPICheckOnUI('Third Board', 'New List', 'New Card')
    });
    test('Move Card', async ({ page }) => {
        const uiValidation = new UIValidationsforAPI(page)
        await uiValidation.moveCartByAPICheckOnUI('Fourth Board', 'New List', 'New Card', 2)
    });
    test('Delete Card', async ({ page }) => {
        const uiValidation = new UIValidationsforAPI(page)
        await uiValidation.deleteCartByAPICheckOnUI('Fifth Board', 'New List', 'New Card')
    });
    test('Delete Board', async ({ page }) => {
        const uiValidation = new UIValidationsforAPI(page)
        await uiValidation.deleteBoardByAPICheckOnUI('Sixth Board')
    });
    test('Delete All Boards', async ({ page }) => {
        const uiValidation = new UIValidationsforAPI(page)
        await uiValidation.deleteAllBoardByAPICheckOnUI()
    });
});