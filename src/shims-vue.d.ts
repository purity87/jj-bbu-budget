/* .vue import 안전하게 하기 위해 추가
* typescript가 .vue 파일을 모듈로 인식
* */
declare module '*.vue' {
    import { DefineComponent } from 'vue'
    const component: DefineComponent<{}, {}, any>
    export default component
}
