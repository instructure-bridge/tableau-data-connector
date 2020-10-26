import { ErrorToast } from '../../lib/errorToast';

describe('ErrorToast', function () {
    beforeEach(() => {
        document.body.innerHTML = '<div id="toastsContainer"></div>';
    });

    it('tests toast defaults', async () => {
        const errorMessage = 'test error';
        new ErrorToast(errorMessage).createToast();

        const toastText = $('.toast-body').text();
        const toastHeader = $('.toast-header').text();

        expect(toastText).toEqual(errorMessage);
        expect(toastHeader).toContain('Error');
    });

    it('tests all options', async () => {
        const errorMessage = 'test error';
        const errorType = 'Warning';
        const delay = 12000;
        new ErrorToast(errorMessage, errorType, delay).createToast();

        const toastText = $('.toast-body').text();
        const toastHeader = $('.toast-header').text();

        expect(toastText).toEqual(errorMessage);
        expect(toastHeader).toContain(errorType);
    });
});
