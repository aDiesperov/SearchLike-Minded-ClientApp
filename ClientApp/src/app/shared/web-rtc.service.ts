import { Injectable } from '@angular/core';
import { SignalrService } from './signalr.service';

@Injectable({
  providedIn: 'root'
})
export class WebRTCService {

  constructor(private signalr: SignalrService) {}

  server = {
    iceServers: [
      {urls: "stun:23.21.150.121"},
      {urls: "stun:stun.l.google.com:19302"}
    ]
  }

  peers = {};

  getStream(video: boolean): Promise<MediaStream> {
    let constr = {
        audio: true,
        video: video
    };
    return navigator.mediaDevices.getUserMedia(constr);
  }

  createOffer(userId: number){
    this.peers[userId] = {
      candidateCache: []
    };

    let pc = new RTCPeerConnection();

    pc.ontrack = function(event) {
      if(event.track.kind === "video"){
        let el = document.createElement('video');
        el.style.position = 'absolute'; el.style.top = '0px'; el.style.left = '0px';
        el.style.width = '200px'; el.style.height = '150px';
        document.querySelector("main").appendChild(el);
        el.srcObject = event.streams[0];
        el.play();
      }
    };

    this.initConnection(pc, userId, 'createOffer');
    this.peers[userId].connection = pc;
    pc.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true })
    .then(offer => pc.setLocalDescription(offer))
  }

  createAnswer(userId: number, desc: string, localStream: MediaStream){
    if (this.peers[userId] === undefined) {
      this.peers[userId] = {
        candidateCache: []
      };
      var pc = new RTCPeerConnection(this.server);
      this.initConnection(pc, userId, "createAnswer");
      this.peers[userId].connection = pc;
      localStream.getTracks().forEach(track => pc.addTrack(track, localStream));

	    pc.setRemoteDescription(JSON.parse(desc));
      pc.createAnswer().then( answer => pc.setLocalDescription(answer) );
    }
  }

  acceptAnswer(userId: number, desc: string){
    this.peers[userId].connection.setRemoteDescription(JSON.parse(desc));
  }

  receiveCandidate(userId, data) {
    var pc = this.peers[userId].connection;
    pc.addIceCandidate(JSON.parse(data));
  }

  initConnection(pc, userId, sdpType) {
    pc.onicecandidate = event => {
      if (event.candidate) {
        this.peers[userId].candidateCache.push(event.candidate);
      } 
      else {
        this.signalr.invoke(sdpType, userId, JSON.stringify(pc.localDescription));
        for (var i = 0; i < this.peers[userId].candidateCache.length; i++) {
          this.signalr.invoke("candidate", userId, JSON.stringify(this.peers[userId].candidateCache[i]));
        }
      }
    }
    pc.oniceconnectionstatechange = event => {
      if (pc.iceConnectionState == "disconnected") {
        delete this.peers[userId];
        console.log('disconnect');
      }
    }
  }
}
