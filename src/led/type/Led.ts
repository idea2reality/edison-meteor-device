export abstract class Led {
    protected id;
    protected value;
    protected protocFormat;

    constructor(id, protocFormat) {
        this.id = id;
        this.protocFormat = protocFormat;
    }

    getStatus() { return this.value; }

    abstract setValue(status): Promise<any>;

    updateId(newId) {
        this.id = newId;
    }
}
