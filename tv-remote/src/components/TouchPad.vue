<template>
  <v-dialog v-model="open" fullscreen>
    <template #activator="{on}">
      <v-btn v-on="on" color="accent" class="activator">
        <v-icon large>mdi-gesture-tap-hold</v-icon>
      </v-btn>
    </template>
    <div class="touch" ref="touch" :v-ripple="{ class: 'white--text' }">
      <v-btn fab fixed top right @click="open = false" color="red">
        <v-icon>mdi-close</v-icon>
      </v-btn>

      <v-icon class="center-icon" size="96">mdi-gesture-tap-hold</v-icon>

      <v-icon size="48" color="grey" class="swipe up" v-if="up">mdi-arrow-up</v-icon>
      <v-icon size="48" color="grey" class="swipe down" v-else-if="down">mdi-arrow-down</v-icon>
      <v-icon size="48" color="grey" class="swipe left" v-else-if="left">mdi-arrow-left</v-icon>
      <v-icon size="48" color="grey" class="swipe right" v-else-if="right">mdi-arrow-right</v-icon>
    </div>
  </v-dialog>
</template>

<script>
import Hammer from 'hammerjs';
import samsungTv from '@/api/tv';

export default {
  name: 'TouchPad',
  data() {
    return {
      open: false,
      swiping: false
    };
  },
  computed: {
    left() {
      return this.swiping === 'left';
    },
    right() {
      return this.swiping === 'right';
    },
    up() {
      return this.swiping === 'up';
    },
    down() {
      return this.swiping === 'down';
    }
  },
  watch: {
    open() {
      if (this.open) {
        this.$nextTick(() => {
          this.register();
        });
      }
    }
  },
  methods: {
    press(method, param) {
      samsungTv[method](param);
    },
    register() {
      const h = new Hammer(this.$refs.touch);

      h.get('swipe').set({direction: Hammer.DIRECTION_ALL});

      h.on('swipeleft swiperight swipeup swipedown tap press', ev => {
        console.log('swipe', ev);
        switch (ev.type) {
          case 'swipeleft':
            this.swiping = 'left';
            this.press('arrow', 'left');
            break;
          case 'swiperight':
            this.swiping = 'right';
            this.press('arrow', 'right');
            break;
          case 'swipeup':
            this.swiping = 'up';
            this.press('arrow', 'up');
            break;
          case 'swipedown':
            this.swiping = 'down';
            this.press('arrow', 'down');
            break;
          case 'tap':
          case 'press':
            if (ev.target.id !== 'close' && ev.target.id !== 'close-icon') {
              this.press('enter');
            }
            break;
        }
        if (this.swiping) {
          setTimeout(() => {
            this.swiping = false;
          }, 500);
        }
      });

      document.addEventListener('keydown', event => {
        if (event.isComposing || event.keyCode === 229) {
          return;
        }
        switch (event.key) {
          case 'ArrowLeft':
          case 'ArrowRight':
          case 'ArrowUp':
          case 'ArrowDown':
            this.press('arrow', event.key.replace('Arrow', '').toLowerCase());
            break;
          case 'Enter':
            this.press('enter');
            break;
          case 's':
            this.press('smartHub');
            break;
        }
      });
    }
  }
};
</script>

<style scoped>
.touch {
  height: 100vh;
  width: 100vw;
  background-color: black;
}

.center-icon {
  position: fixed;
  top: calc(50% - 48px);
  left: calc(50% - 48px);
}

.swipe {
  position: fixed;
  color: #cecece;
}

.swipe.up {
  top: 24px;
  left: calc(50% - 24px);
}
.swipe.down {
  bottom: 24px;
  left: calc(50% - 24px);
}
.swipe.left {
  top: calc(50% - 24px);
  left: 24px;
}
.swipe.right {
  top: calc(50% - 24px);
  right: 24px;
}

.activator.v-btn:not(.v-btn--round).v-size--default {
  min-width: unset;
  width: unset;
  height: unset;
  margin: 4px;
  grid-column: 2;
}
</style>
