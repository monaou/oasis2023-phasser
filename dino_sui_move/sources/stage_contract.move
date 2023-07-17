module dino_sui_move::stage_contract {

    // Part 1: Imports
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::vector;
    use sui::tx_context::{Self, TxContext};

    // Part 2: Struct definitions
    struct ExtraData {
        x: u64,
        y: u64,
        size_x: u64,
        size_y: u64,
        _type: vector<u8>,
    }

    struct Data {
        addr: address,
        name: vector<u8>,
        entry: u64,
        incentive: u64,
        extraDataArr: vector<ExtraData>,
    }

    struct StageContractData has key {
        stageIds: vector<u64>,
        stageNames: vector<vector<u8>>,
        stageAddress: vector<address>,
        dataMap: vector<Data>,
        accountStages: vector<vector<u64>>,
        accountNames: vector<vector<vector<u8>>>,
    }

    // Part 3: Module initializer to be executed when this module is published
    fun init(ctx: &mut TxContext) {
        let admin = Forge {
            id: object::new(ctx),
            swords_created: 0,
        };
        // Transfer the forge object to the module/package publisher
        transfer::transfer(admin, tx_context::sender(ctx));
    }

    // Part 4: Accessors required to read the struct attributes
    public fun setAllData(account: &signer, _stageID: u64, _addr: address, _name: vector<u8>, _entry: u64, _incentive: u64, _extraDataArr: vector<ExtraData>){
        // Some code here
    }

    public fun addExtraData(_stageID: u64, _x: u64, _y: u64, _size_x: u64, _size_y: u64, _type: vector<u8>){
        // Some code here
    }

    public fun get(_stageID: u64): Data acquires StageContractData{
        let data = borrow_global<StageContractData>(0x1::addr);
        // Some code here
        Vector::pop_front(&mut data.dataMap)
    }

    public fun getStageIds(): vector<u64> acquires StageContractData {
        let data = borrow_global<StageContractData>(0x1::addr);
        Vector::copy(&data.stageIds)
    }

    public fun getStageNames(): vector<vector<u8>> acquires StageContractData {
        let data = borrow_global<StageContractData>(0x1::addr);
        Vector::copy(&data.stageNames)
    }

    public fun getStageAddress(): vector<address> acquires StageContractData {
        let data = borrow_global<StageContractData>(0x1::addr);
        Vector::copy(&data.stageAddress)
    }

    public fun getAccountStages(_addr: address): vector<u64> acquires StageContractData {
        let data = borrow_global<StageContractData>(0x1::addr);
        // Some code here
    }

    public fun getAccountNames(_addr: address): vector<vector<u8>> acquires StageContractData {
        let data = borrow_global<StageContractData>(0x1::addr);
        // Some code here
    }

    // Part 5: Public/entry functions (introduced later in the tutorial)

    // Part 6: Private functions (if any)

}