import { Box,Center,Image,Text,Button, useControllableState,Input,Tooltip
} from '@chakra-ui/react'
import React,{useState} from 'react'
import { useMoralis,useWeb3ExecuteFunction } from 'react-moralis'
import MintContract from '../../contract/MintContract.json'
import stikiToken from '../../contract/stikiToken.json'



export default function MintSection() {
    const {account} = useMoralis()
    const contractProcessor = useWeb3ExecuteFunction();
    
    const property = {
        imageUrl: 'https://bit.ly/2Z4KKcF',
        imageAlt: 'Rear view of modern home with pool',
        beds: 3,
        baths: 2,
        title: 'Modern home in city center in the heart of historic Los Angeles',
        formattedPrice: '$1,900.00',
        reviewCount: 34,
        rating: 4,
      }
      const [name,setName] = useState('')
      const [lifePoint, setLifePoint] = useState(0)
      const [internalLifePoint, setInternalLifePoint] = useControllableState({
        lifePoint,
        onChange: setLifePoint,})
    const [power, setPower] = useState(0)

    const [internalPower, setInternalPower] = useControllableState({
        power,
        onChange: setPower,})

    const [dex, setDex] = useState(0)

    const [internalDex, setInternalDex] = useControllableState({
        dex,
        onChange: setDex,})

    const [stamina, setStamina] = useState(0)

    const [internalStamina, setInternalStamina] = useControllableState({
        stamina,
        onChange: setStamina,})

    const [speed, setSpeed] = useState(0)
    const [internalSpeed, setInternalSpeed] = useControllableState({
        speed,
        onChange: setSpeed,})
        
        let optionMint = {
            abi: MintContract.abi,
            contractAddress: MintContract.networks[1337].address,
            functionName: "MintStiki",
            params: {
                _name:name,
                _lifepoint:lifePoint,
                _power:power,
                _dex:dex,
                _stamina:stamina,
                _speed:speed,
                
            }
        }
        const cost = 100

        let optionApprove = {
            abi: stikiToken.abi,
            contractAddress: stikiToken.networks[1337].address,
            functionName: "approve",
            params: {
                spender:MintContract.networks[1337].address,
                amount: cost,
            }
        }



    async function rise(){

        if(lifePoint+power+dex+stamina+speed != 15){
            alert(`Must set 15 points (your set ${lifePoint+power+dex+stamina+speed} point)`)        
        }else{
            const txApprove = await contractProcessor.fetch({params:optionApprove});
        
            const txMint = await contractProcessor.fetch({params:optionMint})   
            console.log(txApprove);
            console.log(txMint)
        }
     
    }
    
      return (
        <Box  borderWidth='1px' borderRadius='lg' >
        <Center marginTop={2}>
          <Image src={property.imageUrl} alt={property.imageAlt} />

        </Center>
            <Box p='6'> 
                <Center marginTop={2}>
                    <Text fontSize='5xl'>Stiki Warrior</Text>
                    

                </Center>
                <Center marginTop={2}>
                <Input placeholder='Name your Warrior' onChange={(e)=>setName(e.target.value)} margin={1} width={200}/>
                <Tooltip label='Put name and set all you 15 points stat' fontSize='md'>
                    <Button><Text fontSize='4xl'>i</Text></Button>
                </Tooltip>
                </Center>
                <Center marginTop={2}>
                    <Text fontSize='2xl' marginRight={5}>Life Points: </Text>
                    <div>
                        <Button onClick={() => setInternalLifePoint(lifePoint + 1)}>+</Button>
                        <Box as='span' w='200px' mx='24px'>
                             {internalLifePoint}
                        </Box>
                        <Button onClick={() => setInternalLifePoint(lifePoint - 1)}>-</Button>
                    </div>

                </Center>
                <Center marginTop={2}>
                    <Text fontSize='2xl' marginRight={11}>Power: </Text>
                    <div>
                        <Button onClick={() => setInternalPower(power + 1)}>+</Button>
                        <Box as='span' w='200px' mx='24px'>
                             {internalPower}
                        </Box>
                        <Button onClick={() => setInternalPower(power - 1)}>-</Button>
                    </div>
                </Center>
                <Center marginTop={2}>
                    <Text fontSize='2xl' marginRight={15}>Dex: </Text>
                    <div>
                        <Button onClick={() => setInternalDex(dex + 1)}>+</Button>
                        <Box as='span' w='200px' mx='24px'>
                             {internalDex}
                        </Box>
                        <Button onClick={() => setInternalDex(dex - 1)}>-</Button>
                    </div>
                </Center>
                <Center marginTop={2}>
                    <Text fontSize='2xl' marginRight={5}>Stamina: </Text>
                    <div>
                        <Button onClick={() => setInternalStamina(stamina + 1)}>+</Button>
                        <Box as='span' w='200px' mx='24px'>
                             {internalStamina}
                        </Box>
                        <Button onClick={() => setInternalStamina(stamina - 1)}>-</Button>
                    </div>
                </Center>
                <Center marginTop={2}>
                    <Text fontSize='2xl' marginRight={5}>Speed: </Text>
                    <div>
                        <Button onClick={() => setInternalSpeed(speed + 1)}>+</Button>
                        <Box as='span' w='200px' mx='24px'>
                             {internalSpeed}
                        </Box>
                        <Button onClick={() => setInternalSpeed(speed - 1)}>-</Button>
                    </div>
                </Center>

                <Center marginTop={5}>
                    <Button onClick={()=>rise()} colorScheme='teal' size='lg'><Text fontSize='3xl'>Rise:    {name}</Text></Button>
                </Center>
        
            </Box>
        </Box>
      )
    }
