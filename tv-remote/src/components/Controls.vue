<template>
  <div class="controls">
    <div id="channels">
      <img v-for="channel in channels"
           :key="channel.number"
           v-bind:src="require('../assets/' + channel.img)"
           @click="press('setChannel', channel.number)">
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
      <v-btn color="accent" @click="press('source')">Src</v-btn>
      <v-btn color="accent" @click="press('arrow', 'up')"><v-icon>mdi-arrow-up</v-icon></v-btn>
      <v-btn color="accent" @click="press('guide')">Guide</v-btn>
      <v-btn color="accent" @click="press('arrow', 'left')"><v-icon>mdi-arrow-left</v-icon></v-btn>
      <v-btn color="accent" @click="press('enter')"><v-icon>mdi-stop</v-icon></v-btn>
      <v-btn color="accent" @click="press('arrow', 'right')"><v-icon>mdi-arrow-right</v-icon></v-btn>
      <v-btn color="accent" @click="press('back')">Back</v-btn>
      <v-btn color="accent" @click="press('arrow', 'down')"><v-icon>mdi-arrow-down</v-icon></v-btn>
      <v-btn color="accent" @click="press('exit')">Exit</v-btn>

      <touch-pad :style="{gridColumn: 2}"/>
    </div>


    <v-btn @click="press('source')">Source</v-btn>
    <v-btn @click="press('menu')">Menu</v-btn>
    <v-btn @click="press('back')">Back</v-btn>

    <v-slider v-model="volume"/>
  </div>
</template>

<script>
import samsungTv from '@/tv';
import TouchPad from '@/components/TouchPad';

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
        {icon: 'skip_previous', param: 'skip-backward'},
        {icon: 'fast_rewind', param: 'backward'},
        {icon: 'play_arrow', param: 'play'},
        {icon: 'pause', param: 'pause'},
        {icon: 'stop', param: 'stop'},
        {icon: 'fast_forward', param: 'forward'},
        {icon: 'skip_next', param: 'skip-forward'}
      ],
      volume: 0,
      muted: false,
      ignoreInput: false
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
  methods: {
    press(method, param) {
      samsungTv[method](param);
    },
    volumeChange(volume) {
      if (this.ignoreInput) {
        return;
      }
      console.log(volume);
      // todo: volume control
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
}

@media (max-width: 480px) {
  #transport .md-button.md-icon-button {
    margin: 0;
  }
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
  min-width: unset;
  width: unset;
  height: unset;
  font-size: 2em;
  margin: 4px;
}

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