import { myP2P } from "../main";

export function hideUI() {
  model.isUIVisible = false;
}

export const model = {
  isUIVisible: true,
  id: "",
  hid: "",
  stringData: "",
  sendData: (e: any, m: any) => {
    if (m.stringData == "") return;
    myP2P.sendData(m.stringData);
  },
  client: (e: any, m: any) => {
    if (m.hid == "") return;
    console.log("debug: ", m.hid);
    myP2P.connectPeer(m.hid);
  },
};

export const template = `
<style> 
    canvas{ 
        position: fixed; 
        top:50%; 
        left:50%; 
        transform: translate(-50% , -50%);
    }

    hud-ui{
        display: block;
        width: 800px;
        height: 600px;
        position: fixed; 
        top:50%; 
        left:50%; 
        transform: translate(-50% , -50%);
    }

    input,p{
    width: 450px;
    }
</style> 
<div> 
    <canvas id='cnv'> </canvas> 
    <hud-ui \${===isUIVisible}>
        <div style="padding: 10px; gap: 10px; width: 25%; height: 100%; display: flex; flex-direction: column;">
            
            <button \${click@=>client}>Connect to Host</button>
            <div>
                <label for="peerId">Peer ID:</label>
                <p id="peerId" \${innerText<=>id}></p>
                <input type="text" \${value<=>hid}></input>
            </div>
        <div>
            <button \${click@=>sendData}>Send Data</button>
            <label>Data to Send:</label>
            <input type="text" \${value<=>stringData}></input>
        </div>
            </div>

        
   </hud-ui>

</div>`;
