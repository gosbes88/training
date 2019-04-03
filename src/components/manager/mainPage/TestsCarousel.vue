<template>
    <div ref="carousel" @wheel="moveByWheel">
        <button v-show="Math.abs(position) < Math.abs(maxPosition)"
                class='carousel-block__btn-next'
                type='button'
                @mousedown="goNext"
        >
            <i class='carousel-block__next-icon'></i>
        </button>
        <button v-show="position < 0"
                class='carousel-block__btn-prev'
                type='button'
                @mousedown="goPrev"
        >
            <i class='carousel-block__prev-icon'></i>
        </button>
        <div ref="list" class="carousel-block__list">
            <div ref="item" class="carousel-block__item" v-for="test in tests" :key="test.id">
                <test-item
                    :test="test"
                    :chart-position="{}"
                    :progress-position="{}"
                    @click="savePosition(index + 1)"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "tests-carousel",
        data() {
            return {
                isTouch: typeof window !== "undefined" && "ontouchstart" in window,
                width: 0,
                position: 0,
                itemWidth: 0,
                maxPosition: 0,
                minIndexForScrolling: 3,
                dragStartX: 0,
                timer: null,
                dragging: false,
                keyCodes: {
                    RIGHT: 37,
                    LEFT: 39
                }
            };
        },
        props: {
            count: {
                type: Number,
                default: 5
            },
            movedItems: {
                type: Number,
                default: 1
            }
        },
        components: {
            TestItem: () => import('./Test')
        },
        mounted() {
            this.width = this.$refs.carousel.offsetWidth / this.count;
            this.maxPosition = this.$refs.item.length * this.width - this.count * this.width;
            this.$refs.item.forEach(item => item.style.width = this.width + "px");
            document.addEventListener("keydown", this.moveByKey);
            document.addEventListener("mouseup", this.clearTimer);
            this.$el.addEventListener(this.isTouch ? "touchstart" : "mousedown", this.onStart);
            this.setPositionScroll();
        },
        methods: {
            setPositionScroll() {
                let index = window.sessionStorage.getItem("surveysScrollPosition") || 0;
                index = index >= this.$refs.item.length - 2 ? this.$refs.item.length - 2 : index;
                const scrollPosition = index <= this.minIndexForScrolling ? 0 : (index - this.minIndexForScrolling) * this.width;
                this.position = -Number(scrollPosition);
                this.$refs.list.style.marginLeft = this.position + 'px';
            },
            savePosition(index) {
                window.sessionStorage.setItem("surveysScrollPosition", index);
            },
            onStart(event) {
                document.addEventListener(
                    this.isTouch ? "touchend" : "mouseup",
                    this.onEnd
                );

                document.addEventListener(
                    this.isTouch ? "touchmove" : "mousemove",
                    this.onDrag
                );

                this.dragging = true;
                this.dragStartX = this.isTouch ? event.touches[0].clientX : event.clientX;
            },
            onEnd(event) {
                event.stopPropagation();
                this.dragging = false;
                const items = Math.round(this.position / this.width);
                this.position = this.width * items;
                this.$refs.list.style.marginLeft = this.position + 'px';
                document.removeEventListener(
                    this.isTouch ? "touchend" : "mouseup",
                    this.onEnd
                );
                document.removeEventListener(
                    this.isTouch ? "touchmove" : "mousemove",
                    this.onDrag
                );
            },
            onDrag(event) {
                if (!this.dragging) {
                    return;
                }
                const eventPosX = this.isTouch ? event.touches[0].clientX : event.clientX;
                const newOffsetX = this.dragStartX - eventPosX;

                if (newOffsetX > 0) {
                    this.position = Math.max(this.position - newOffsetX, -this.width * (this.$refs.item.length - this.count));
                } else if (newOffsetX < 0) {
                    this.position = Math.min(this.position - newOffsetX, 0);
                }

                this.$refs.list.style.marginLeft = this.position + 'px';
                this.dragStartX = eventPosX;
            },
            goPrev(event) {
                this.position = Math.min(this.position + this.width * this.movedItems, 0);
                this.$refs.list.style.marginLeft = this.position + 'px';
                this.timer = setTimeout(() => this.goPrev(event), 200);
            },
            goNext(event) {
                this.position = Math.max(this.position - this.width * this.movedItems, -this.width * (this.$refs.item.length - this.count));
                this.$refs.list.style.marginLeft = this.position + 'px';
                this.timer = setTimeout(() => this.goNext(event), 200);
            },
            clearTimer() {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
            },
            moveByWheel(event) {
                if (event.deltaX > 0 || event.deltaY < 0 || event.wheelDelta > 0) {
                    this.position = Math.min(this.position + this.width * this.movedItems, 0);
                } else if (event.deltaX < 0 || event.deltaY > 0 || event.wheelDelta < 0) {
                    this.position = Math.max(this.position - this.width * this.movedItems, -this.width * (this.$refs.item.length - this.count));
                }
                this.$refs.list.style.marginLeft = this.position + 'px';
            },
            moveByKey(event) {
                if (event.keyCode === this.keyCodes.LEFT) {
                    this.position = Math.max(this.position - this.width, -this.width * (this.$refs.item.length - this.count));
                } else if (event.keyCode === this.keyCodes.RIGHT) {
                    this.position = Math.min(this.position + this.width, 0);
                }
                this.$refs.list.style.marginLeft = this.position + 'px';
            }
        },
        computed: {
            ...mapGetters('manager', [
                'tests'
            ])
        },
        beforeDestroy() {
            this.$el.removeEventListener(this.isTouch ? "touchstart" : "mousedown", this.onStart);
            document.removeEventListener("keydown", this.moveByKey);
            document.removeEventListener("mouseup", this.clearTimer);
        }
    };
</script>
