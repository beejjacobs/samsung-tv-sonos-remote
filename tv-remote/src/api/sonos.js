function onDeviceReady() {
  cordova.plugin.http.setDataSerializer('utf8');
}

document.addEventListener('deviceready', onDeviceReady);

export class Sonos {
  constructor({ip}) {
    this.ip = ip;
    this.parser = new DOMParser();
  }

  async getMute() {
    const res = await this._request(Actions.GetMute, content.getMute(), true);
    return parseInt(res) === 1;
  }

  async setMute(muted) {
    await this._request(Actions.SetMute, content.setMute(muted));
  }

  async getVolume() {
    const res = await this._request(Actions.GetVolume, content.getVolume(), true);
    return parseInt(res);
  }

  async setVolume(volume) {
    await this._request(Actions.SetVolume, content.setVolume(volume));
  }

  async setVolumeRel(adjustment) {
    const res = await this._request(Actions.SetRelativeVolume, content.setVolumeRel(adjustment), true);
    return parseInt(res);
  }

  /**
   * @return {string}
   * @private
   */
  get _url() {
    return `http://${this.ip}:1400/MediaRenderer/RenderingControl/Control`
  }

  /**
   * @private
   */
  async _request(action, xml, hasResponse = false) {
    const res = await this._postData(action, xml);
    if (hasResponse) {
      const doc = this.parser.parseFromString(res, 'text/xml');
      return doc.firstElementChild.firstElementChild.firstElementChild.firstElementChild.textContent;
    }
  }

  /**
   * @param {string} action
   * @param {string} xml
   * @return {Promise<string>}
   * @private
   */
  async _postData(action, xml) {
    return new Promise((resolve, reject) => {
      /* global cordova */
      cordova.plugin.http.post(this._url, xml, {
            'Content-Type': 'text/xml',
            'SOAPAction': `urn:schemas-upnp-org:service:RenderingControl:1#${action}`
          },
          res => {
            if (res.status !== 200) {
              reject(res);
            } else {
              resolve(res.data);
            }
          },
          res => {
            reject(res.error);
          });
    });
  }
}

const Actions = {
  GetMute: 'GetMute',
  SetMute: 'SetMute',
  GetVolume: 'GetVolume',
  SetVolume: 'SetVolume',
  SetRelativeVolume: 'SetRelativeVolume'
};

const content = {
  wrapper(action, value) {
    return `<s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
    <s:Body>
        <u:${action} xmlns:u="urn:schemas-upnp-org:service:RenderingControl:1">
            <InstanceID>0</InstanceID>
            <Channel>Master</Channel>
            ${value}
        </u:${action}>
    </s:Body>
</s:Envelope>`;
  },
  getMute() {
    return this.wrapper(Actions.GetMute);
  },
  setMute(muted) {
    return this.wrapper(Actions.SetMute, `<DesiredMute>${muted ? 1 : 0}</DesiredMute>`);
  },

  getVolume() {
    return this.wrapper(Actions.GetVolume);
  },
  setVolume(volume) {
    return this.wrapper(Actions.SetVolume, `<DesiredVolume>${volume}</DesiredVolume>`);
  },
  setVolumeRel(adjustment) {
    return this.wrapper(Actions.SetRelativeVolume, `<Adjustment>${adjustment}</Adjustment>`);
  }
};
