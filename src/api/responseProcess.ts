import { Strategy } from './strategies';

class ResponseProcess {
    private strategy: Strategy;

    constructor(strategy: Strategy) {
        this.strategy = strategy;
    }

    setStrategy(strategy: Strategy) {
        this.strategy = strategy;
    }

    run(column: any, data: any, linkedData?: any): Array<any> {
        return this.strategy.processData(column, data, linkedData);
    }
}

export { ResponseProcess };
