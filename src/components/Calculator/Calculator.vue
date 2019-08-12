<template>
    <div id="calculator" class="calculator" ref="calculator">
        <div class="top-bar">
            <div class="button close" v-on:click="close()"></div>
            <div class="button minimise"></div>
            <div class="button maximise" v-on:click="minimise()"></div>
        </div>
        <div class="screen">
            <div class="value" v-bind:style="{fontSize: getFontSize()}">
                {{conf.value}}
            </div>
        </div>
        <div class="buttons">

            <template :id="btn.name" v-for="(btn, index) in buttons">

                <div class="calc-btn"
                     v-bind:ref="`item${index}`"
                     v-bind:key="btn.label"
                     v-bind:class="[btn.class, conf.lastClick === btn.label && btn.highlightClass]"
                     v-on:click="handleClick(conf, btn)">
                    {{btn.label}}
                </div>

            </template>
        </div>

    </div>
</template>

<script src="./script.js"></script>
<style lang="sass">
    @import "./styles"
</style>
