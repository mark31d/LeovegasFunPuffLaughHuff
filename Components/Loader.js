// Components/Loader.js
import React, { useEffect, useRef } from 'react';
import { StyleSheet, Animated, Image, ImageBackground, View, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

const { width } = Dimensions.get('window');

const BG   = require('../assets/bg.webp');
const LOGO = require('../assets/Logo.webp');

/* размеры */
const LOGO_SIZE = 350;                                       // большой логотип сверху (квадрат)
const SIDE = Math.min(240, Math.round(width * 0.62));        // квадрат под анимацию снизу

/* Полный HTML + CSS (с лапками) */
const HTML = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,viewport-fit=cover"/>
<style>
html,body{height:100%;margin:0;background:transparent;overflow:hidden}
.wrap{height:100%;display:grid;place-items:center;background:transparent}

/* From Uiverse.io by Nawsome */
.wheel-and-hamster{--dur:1s;position:relative;width:12em;height:12em;font-size:14px}
.wheel,.hamster,.hamster div,.spoke{position:absolute}
.wheel,.spoke{border-radius:50%;top:0;left:0;width:100%;height:100%}
.wheel{background:radial-gradient(100% 100% at center,hsla(0,0%,60%,0) 47.8%,hsl(0,0%,60%) 48%);z-index:2}
.hamster{animation:hamster var(--dur) ease-in-out infinite;top:50%;left:calc(50% - 3.5em);width:7em;height:3.75em;transform:rotate(4deg) translate(-0.8em,1.85em);transform-origin:50% 0;z-index:1}
.hamster__head{animation:hamsterHead var(--dur) ease-in-out infinite;background:hsl(30,90%,55%);border-radius:70% 30% 0 100% / 40% 25% 25% 60%;box-shadow:0 -0.25em 0 hsl(30,90%,80%) inset,0.75em -1.55em 0 hsl(30,90%,90%) inset;top:0;left:-2em;width:2.75em;height:2.5em;transform-origin:100% 50%}
.hamster__ear{animation:hamsterEar var(--dur) ease-in-out infinite;background:hsl(0,90%,85%);border-radius:50%;box-shadow:-0.25em 0 hsl(30,90%,55%) inset;top:-0.25em;right:-0.25em;width:.75em;height:.75em;transform-origin:50% 75%}
.hamster__eye{animation:hamsterEye var(--dur) linear infinite;background:#000;border-radius:50%;top:.375em;left:1.25em;width:.5em;height:.5em}
.hamster__nose{background:hsl(0,90%,75%);border-radius:35% 65% 85% 15% / 70% 50% 50% 30%;top:.75em;left:0;width:.2em;height:.25em}
.hamster__body{animation:hamsterBody var(--dur) ease-in-out infinite;background:hsl(30,90%,90%);border-radius:50% 30% 50% 30% / 15% 60% 40% 40%;box-shadow:.1em .75em 0 hsl(30,90%,55%) inset,.15em -.5em 0 hsl(30,90%,80%) inset;top:.25em;left:2em;width:4.5em;height:3em;transform-origin:17% 50%;transform-style:preserve-3d}

.hamster__limb--fr,.hamster__limb--fl{
  clip-path:polygon(0 0,100% 0,70% 80%,60% 100%,0% 100%,40% 80%);
  top:2em;left:.5em;width:1em;height:1.5em;transform-origin:50% 0
}
.hamster__limb--fr{animation:hamsterFRLimb var(--dur) linear infinite;background:linear-gradient(hsl(30,90%,80%) 80%,hsl(0,90%,75%) 80%);transform:rotate(15deg) translateZ(-1px)}
.hamster__limb--fl{animation:hamsterFLLimb var(--dur) linear infinite;background:linear-gradient(hsl(30,90%,90%) 80%,hsl(0,90%,85%) 80%);transform:rotate(15deg)}

.hamster__limb--br,.hamster__limb--bl{
  border-radius:.75em .75em 0 0;
  clip-path:polygon(0 0,100% 0,100% 30%,70% 90%,70% 100%,30% 100%,40% 90%,0% 30%);
  top:1em;left:2.8em;width:1.5em;height:2.5em;transform-origin:50% 30%
}
.hamster__limb--br{animation:hamsterBRLimb var(--dur) linear infinite;background:linear-gradient(hsl(30,90%,80%) 90%,hsl(0,90%,75%) 90%);transform:rotate(-25deg) translateZ(-1px)}
.hamster__limb--bl{animation:hamsterBLLimb var(--dur) linear infinite;background:linear-gradient(hsl(30,90%,90%) 90%,hsl(0,90%,85%) 90%);transform:rotate(-25deg)}

.hamster__tail{animation:hamsterTail var(--dur) linear infinite;background:hsl(0,90%,85%);border-radius:.25em 50% 50% .25em;box-shadow:0 -0.2em 0 hsl(0,90%,75%) inset;top:1.5em;right:-.5em;width:1em;height:.5em;transform:rotate(30deg) translateZ(-1px);transform-origin:.25em .25em}
.spoke{animation:spoke var(--dur) linear infinite;background:radial-gradient(100% 100% at center,hsl(0,0%,60%) 4.8%,hsla(0,0%,60%,0) 5%),linear-gradient(hsla(0,0%,55%,0) 46.9%,hsl(0,0%,65%) 47% 52.9%,hsla(0,0%,65%,0) 53%) 50% 50%/99% 99% no-repeat}

@keyframes hamster{from,to{transform:rotate(4deg) translate(-0.8em,1.85em)}50%{transform:rotate(0) translate(-0.8em,1.85em)}}
@keyframes hamsterHead{from,25%,50%,75%,to{transform:rotate(0)}12.5%,37.5%,62.5%,87.5%{transform:rotate(8deg)}}
@keyframes hamsterEye{from,90%,to{transform:scaleY(1)}95%{transform:scaleY(0)}}
@keyframes hamsterEar{from,25%,50%,75%,to{transform:rotate(0)}12.5%,37.5%,62.5%,87.5%{transform:rotate(12deg)}}
@keyframes hamsterBody{from,25%,50%,75%,to{transform:rotate(0)}12.5%,37.5%,62.5%,87.5%{transform:rotate(-2deg)}}
@keyframes hamsterFRLimb{from,25%,50%,75%,to{transform:rotate(50deg) translateZ(-1px)}12.5%,37.5%,62.5%,87.5%{transform:rotate(-30deg) translateZ(-1px)}}
@keyframes hamsterFLLimb{from,25%,50%,75%,to{transform:rotate(-30deg)}12.5%,37.5%,62.5%,87.5%{transform:rotate(50deg)}}
@keyframes hamsterBRLimb{from,25%,50%,75%,to{transform:rotate(-60deg) translateZ(-1px)}12.5%,37.5%,62.5%,87.5%{transform:rotate(20deg) translateZ(-1px)}}
@keyframes hamsterBLLimb{from,25%,50%,75%,to{transform:rotate(20deg)}12.5%,37.5%,62.5%,87.5%{transform:rotate(-60deg)}}
@keyframes hamsterTail{from,25%,50%,75%,to{transform:rotate(30deg) translateZ(-1px)}12.5%,37.5%,62.5%,87.5%{transform:rotate(10deg) translateZ(-1px)}}
@keyframes spoke{from{transform:rotate(0)}to{transform:rotate(-1turn)}}
</style></head>
<body>
  <div class="wrap" role="img" aria-label="Orange and tan hamster running in a metal wheel">
    <div class="wheel-and-hamster">
      <div class="wheel"></div>
      <div class="hamster">
        <div class="hamster__body">
          <div class="hamster__head">
            <div class="hamster__ear"></div>
            <div class="hamster__eye"></div>
            <div class="hamster__nose"></div>
          </div>
          <div class="hamster__limb hamster__limb--fr"></div>
          <div class="hamster__limb hamster__limb--fl"></div>
          <div class="hamster__limb hamster__limb--br"></div>
          <div class="hamster__limb hamster__limb--bl"></div>
          <div class="hamster__tail"></div>
        </div>
      </div>
      <div class="spoke"></div>
    </div>
  </div>
</body></html>`;

export default function Loader({ delay = 1500, fadeMs = 250, onFinish = () => {} }) {
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const t = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: fadeMs, useNativeDriver: true })
        .start(({ finished }) => finished && onFinish());
    }, delay);
    return () => clearTimeout(t);
  }, [delay, fadeMs, onFinish, opacity]);

  return (
    <Animated.View style={[styles.root, { opacity }]}>
      <ImageBackground source={BG} style={styles.bg} resizeMode="cover">
        <SafeAreaView style={styles.container} edges={['top','left','right','bottom']}>
          {/* ЛОГО СВЕРХУ (350×350) */}
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />

          {/* АНИМАЦИЯ ВНИЗУ */}
          <View style={styles.loaderCard}>
            <WebView
              originWhitelist={['*']}
              source={{ html: HTML }}
              style={styles.web}
              automaticallyAdjustContentInsets={false}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              containerStyle={{ backgroundColor: 'transparent' }}
            />
          </View>
        </SafeAreaView>
      </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  bg: { flex: 1, width: '100%', height: '100%' },

  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',   // логотип сверху, анимация снизу
    paddingTop: 12,
    paddingBottom: 18,
  },

  logo: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    borderRadius: 22,
  },

  /* строгий квадрат (карточка для WebView) */
  loaderCard: {
    width: SIDE + 24,
    height: SIDE + 24,
    padding: 12,
    borderRadius: 24,
    backgroundColor: 'rgba(32,32,38,0.86)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },

  web: {
    width: SIDE,
    height: SIDE,
    backgroundColor: 'transparent',
  },
});
