from web3 import Web3
import qrcode

# Initialize Web3
w3 = Web3(Web3.HTTPProvider('http://127.0.0.1:8545'))  #Dummy IP

# Smart Contract Details
contract_address = '0xTicketPurchaseContract'
ticketing_abi = 'YourABIHere'

contract = w3.eth.contract(address=Web3.toChecksumAddress(contract_address), abi=ticketing_abi)

# Fetch the most recent block
latest_block = w3.eth.getBlock('latest')

# Event Signature for TicketPurchased (you need to get it based on your contract's ABI)
event_signature = '0x' + w3.sha3(text='TicketPurchased(address,uint256,string)').hex()[2:]

# Loop through the logs to find the TicketPurchased event
for log in latest_block['logs']:
    if log['topics'][0] == event_signature:
        decoded_log = contract.events.TicketPurchased().processLog(log)
        buyer_address = decoded_log['args']['buyer']
        token_id = decoded_log['args']['tokenId']

        # Create the data you want to embed into the QR code
        qr_data = f"Address: {buyer_address}, Token ID: {token_id}"

        # Generate QR Code
        qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_L, box_size=10, border=4)
        qr.add_data(qr_data)
        qr.make(fit=True)

        img = qr.make_image(fill_color="black", back_color="white")
        
        # Save the image
        img.save(f"QR_{buyer_address}_{token_id}.png")


