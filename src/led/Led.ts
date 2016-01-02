abstract class Led {
    private id;
    protected value;
    protected protocFormat;

    constructor(id, protocFormat) {
        this.id = id;
        this.protocFormat = protocFormat;
    }

    getStatus() { return this.value; }

    abstract getProtoc(status);
    abstract setValue(status): Promise<any>;
    abstract setLedOff(): Promise<any>;
}

export default Led;
