
../../../bin/configtxgen -profile TwoOrgsOrdererGenesis -outputBlock ./channel/genesis.block
../../../bin/configtxgen -profile TwoOrgsChannel -outputCreateChannelTx ./mychannel1.tx -channelID trchannel

