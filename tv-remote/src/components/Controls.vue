<template>
  <div class="controls">
    <div id="channels">
      <img v-for="channel in channels"
           :key="channel.number"
           v-bind:src="require('../assets/' + channel.img)"
           @click="press('setChannel', channel.number)">
    </div>

    <div id="misc">
      <v-btn id="volumeUp" fab color="primary" @click="volumeUp">
        <v-icon>mdi-volume-high</v-icon>
      </v-btn>
      <v-btn id="volumeDown" fab color="primary" @click="volumeDown">
        <v-icon>mdi-volume-medium</v-icon>
      </v-btn>
      <v-btn id="mute" fab @click="toggleMute" :color="muted ? 'red' : 'primary'">
        <v-icon>mdi-volume-off</v-icon>
      </v-btn>
      <v-btn id="channelUp" fab color="primary" @click="press('channelUp')">
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <v-btn id="channelDown" fab color="primary" @click="press('channelDown')">
        <v-icon>mdi-minus</v-icon>
      </v-btn>
      <v-btn id="hdmi" fab color="primary" @click="press('hdmi')">
        <v-icon>mdi-video-input-hdmi</v-icon>
      </v-btn>
      <v-btn id="tv" fab color="primary" @click="press('tv')">
        <v-icon>mdi-television</v-icon>
      </v-btn>
      <v-btn id="info" fab color="primary" @click="press('info')">
        <v-icon>mdi-information-outline</v-icon>
      </v-btn>
      <v-btn id="tools" fab color="primary" @click="press('tools')">
        <v-icon>mdi-wrench</v-icon>
      </v-btn>
      <v-btn id="menu" fab color="primary" @click="press('menu')">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
      <img id="smartHub" :src="require('../assets/smarthub.png')" @click="press('smartHub')">
      <div id="slider">
        <v-slider color="white" v-model="volume" @change="setVolume"/>
      </div>
    </div>

    <div id="keypad">
      <v-btn v-for="key in [1,2,3,4,5,6,7,8,9,0]"
             :key="key"
             color="blue-grey"
             class="key"
             @click="press('number', key)">
        {{ key }}
      </v-btn>
    </div>

    <div id="dpad">
      <v-btn color="primary" @click="press('source')">Src</v-btn>
      <v-btn color="accent" @click="press('arrow', 'up')"><v-icon>mdi-arrow-up</v-icon></v-btn>
      <v-btn color="primary" @click="press('guide')">Guide</v-btn>
      <v-btn color="accent" @click="press('arrow', 'left')"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <v-btn color="accent" @click="press('enter')"><v-icon>mdi-stop</v-icon></v-btn>
      <v-btn color="accent" @click="press('arrow', 'right')"><v-icon>mdi-arrow-right</v-icon></v-btn>
      <v-btn color="primary" @click="press('back')">Back</v-btn>
      <v-btn color="accent" @click="press('arrow', 'down')"><v-icon>mdi-arrow-down</v-icon></v-btn>
      <v-btn color="primary" @click="press('exit')">Exit</v-btn>

      <touch-pad/>
    </div>

    <div id="transport">
      <v-btn v-for="transport in transports"
             :key="transport.icon"
             fab
             small
             color="deep-purple"
             @click="press('transport', transport.param)">
        <v-icon>mdi-{{ transport.icon }}</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
import samsungTv from '@/api/tv';
import TouchPad from '@/components/TouchPad';
import speaker from '@/api/speaker';

export default {
  name: 'Controls',
  components: {TouchPad},
  data() {
    return {
      swipeView: false,
      swiping: false,
      channels: [
        {img: 'bbconehd.png', number: '101'},
        {img: 'bbctwohd.png', number: '102'},
        {img: 'itvhd.png', number: '103'},
        {img: 'channel4hd.png', number: '104'}
      ],
      transports: [
        {icon: 'skip-previous', param: 'skip-backward'},
        {icon: 'rewind', param: 'backward'},
        {icon: 'play', param: 'play'},
        {icon: 'pause', param: 'pause'},
        {icon: 'stop', param: 'stop'},
        {icon: 'fast-forward', param: 'forward'},
        {icon: 'skip-next', param: 'skip-forward'}
      ],
      volume: 0,
      muted: false
    }
  },
  computed: {
    muteButtonClass() {
      return this.muted ? this.iconButton + ' red' : this.iconButton;
    },
    sliderStyle() {
      return {
        "backgroundColor": "#fff"
      };
    },
    sliderBackground() {
      return {
        "backgroundColor": "#808080"
      };
    }
  },
  async mounted() {
    try {
      await this.getVolume();
    } catch (e) {
      await this.getVolume();
    }
    try {
      await this.getMute();
    } catch (e) {
      await this.getMute();
    }
  },
  methods: {
    press(method, param) {
      samsungTv[method](param);
    },
    async getVolume() {
      this.volume = await speaker.getVolume();
    },
    async setVolume(value) {
      try {
        await speaker.setVolume(value);
      } catch (e) {
        console.error('setVolume', e);
      }
    },
    async volumeUp() {
      try {
        this.volume = await speaker.setVolumeRel(2);
      } catch (e) {
        console.error(e);
      }
    },
    async volumeDown() {
      try {
        this.volume = await speaker.setVolumeRel(-2);
      } catch (e) {
        console.error(e);
      }
    },
    async getMute() {
      this.muted = await speaker.getMute();
    },
    async toggleMute() {
      try {
        const muted = await speaker.getMute();
        await speaker.setMute(!muted);
        this.muted = await speaker.getMute();
      } catch (e) {
        console.error(e);
      }
    }
  }
};
</script>

<style scoped>
.controls {
  display: grid;
  grid-template-columns: repeat(6, 16.6vw);
  grid-template-rows: repeat(10, 10vh);
  width: 100vw;
  height: 100vh;
}

#channels,
#transport,
#misc {
  grid-column: span 6;
}

#keypad,
#dpad {
  display: grid;
  grid-template-columns: repeat(3, 16vw);
  grid-template-rows: repeat(4, 1fr);
}

#keypad *:last-child,
#dpad *:last-child{
  grid-column: 2;
}

#channels {
  grid-row: 1;
}
#channels img {
  max-width: 24vw;
  outline: 2px solid black;
  outline-offset: -2px;
}
#transport,
#channels {
  justify-self: center;
  align-self: center;
}
#transport {
  grid-row: 10;
  width: 90%;
  justify-content: space-around;
  display: flex;
}

#keypad {
  grid-column: 1 / 4;
  grid-row: 6 / 10;
}

#dpad {
  grid-column: 4 / 7;
  grid-row: 6 / 10;
}

#misc {
  display: grid;
  grid-row: 2 / 6;
  grid-template-columns: repeat(5, 18vw);
  grid-template-rows: repeat(3, 10vh);
  width: 90vw;
  align-self: center;
  justify-self: center;
  align-items: center;
  justify-items: center;
}
#volumeUp {
  grid-area: 1 / 1;
}
#volumeDown {
  grid-area: 2 / 1;
}
#slider {
  grid-area: 4 / 1 / 4 / 6;
  width: 90%;
  margin-top: 2vh;
}
#mute {
  grid-area: 3 / 1;
}
#mute.red {
  background-color: #e91e63 !important;
}
#tv {
  grid-area: 1 / 2;
}
#hdmi {
  grid-area: 1 / 4;
}
#info {
  grid-area: 3 / 4;
}
#tools {
  grid-area: 3 / 2;
}
#smartHub {
  max-width: 60px;
  grid-area: 2 / 3;
}
#channelUp {
  grid-area: 1 / 5;
}
#channelDown {
  grid-area: 2 / 5;
}
#menu {
  grid-area: 3 / 5;
}

.key.v-btn:not(.v-btn--round).v-size--default {
  font-size: 2em;
}

.key.v-btn:not(.v-btn--round).v-size--default,
#dpad .v-btn:not(.v-btn--round).v-size--default {
  min-width: unset;
  width: unset;
  height: unset;
  margin: 4px;
}
.dpad {
  width: 90%;
}
.dpad.icon {
  font-size: 2em;
}
</style>
