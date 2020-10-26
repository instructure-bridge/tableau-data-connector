class ErrorToast {
    errorType: string;
    errorMessage: string;
    delay: number;

    constructor(
        errorMessage: any,
        errorType: string = 'Error',
        delay: number = 8000,
    ) {
        this.errorType = errorType;
        this.errorMessage = errorMessage.toString();
        this.delay = delay;
    }

    createToast() {
        let toastContainer: any = this.createToastContainer();
        toastContainer = this.createToastHeader(toastContainer);
        toastContainer = this.createToastContent(toastContainer);

        // Ensure the toast always hits destroy
        try {
            this.initToast(toastContainer);
        } finally {
            this.destroyToast(toastContainer);
        }
    }

    createToastContainer() {
        const toastContainer = $('<div></div>');
        toastContainer.addClass('toast');
        return toastContainer;
    }

    createToastHeader(toastContainer) {
        const toastHeader = $('<div></div>');
        toastHeader
            .addClass('toast-header bg-warning')
            .append(
                `<strong class="mr-auto" id="toast-warning-header">${this.errorType}</strong>`,
                '<button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">' +
                    '<span aria-hidden="true">&times;</span>' +
                    '</button>',
            );
        toastContainer.append(toastHeader);
        return toastContainer;
    }

    createToastContent(toastContainer) {
        const toastContent = $('<div></div>');
        toastContent.addClass('toast-body');
        toastContent.html(this.errorMessage);
        toastContainer.append(toastContent);
        return toastContainer;
    }

    initToast(toastContainer) {
        $('#toastsContainer').append(toastContainer);
        $('.toast').toast({ delay: this.delay });
        $('.toast').toast('show');
    }

    destroyToast(toastContainer) {
        setTimeout(() => {
            toastContainer.remove();
        }, this.delay);
    }
}

export { ErrorToast };
