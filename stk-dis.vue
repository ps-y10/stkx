<template>
  <div class="stock-display-page"><!-- main -->
    <!-- Row1 column1 -->
    <div class="ns-panel x-1 y-1" @keydown="e => changeCriteria(e)">
      <ns-textbox
        class="x-1 y-1 w-9x l-3"
        label="Depot"
        ref="depot"
        v-model.trim="form.depotCode"
        @keydown="e => changeData('depot', e)"
      />
      <ns-button class="x-10x y-1 w-1" @click="showLov('depot')">&raquo;</ns-button>
      <ns-textbox class="x-1 y-2 w-9x l-3" :value="form.groupCode || 'All'" label="Group" readonly/>
      <ns-button class="x-10x y-2 w-1" @click="showLov('group')">&raquo;</ns-button>
      <ns-textbox
        class="x-1 y-3 w-9x l-3"
        label="Product"
        ref="prod"
        v-model.trim="form.prodCode"
        @keydown="e => changeData('prod', e)"
      />
      <ns-button class="x-10x y-3 w-1" @click="showLov('prod')">&raquo;</ns-button>
      <ns-textbox
        class="x-1 y-4 w-9x l-3"
        label="Bag N' Start"
        ref="bagN"
        v-model.trim="form.bagNCode"
        @keydown="e => changeBagN('bagN', e)"
      />
      <ns-textbox
        class="x-1 y-5 w-9x l-3"
        label="Bag N' End"
        ref="bagNEnd"
        v-model.trim="form.bagNCodeEnd"
        @keydown="e => changeBagNEnd('bagNEnd', e)"
      />
      <ns-textbox
        class="x-1 y-6 w-9x l-3"
        label="State"
        ref="state"
        v-model.trim="form.stateCode"
        @keydown="e => changeData('state', e)"
      />
      <ns-button class="x-10x y-6 w-1" @click="showLov('state')">&raquo;</ns-button>
      <ns-textbox class="x-1 y-7 w-9x l-3" v-model.trim="form.suppleCode" label="Supplements" readonly/>
      <ns-button class="x-10x y-7 w-1" @click="showLov('supple')">&raquo;</ns-button>
    </div>

    <!-- Row1 column2 -->
    <div class="ns-panel x-12 y-1" @keydown="e => changeCriteria(e)">
      <!-- Date -->
      <div class="x-3 y-1 w-5 ns-label">Date of collection</div>
      <div class="x-8 y-1 w-2 ns-label">Time</div>
      <ns-date-input class="x-1 y-2 w-6 l-2" label="Start" v-model="form.colStartDate"/>
      <ns-date-input class="x-7 y-2 w-3" type="time" v-model="form.colStartTime"/>
      <ns-date-input class="x-1 y-3 w-6 l-2" label="End" v-model="form.colEndDate"/>
      <ns-date-input class="x-7 y-3 w-3" type="time" v-model="form.colEndTime"/>

      <div class="x-12x y-1 w-5 ns-label">Expiry Date</div>
      <div class="x-17x y-1 w-2 ns-label">Time</div>
      <ns-date-input class="x-10x y-2 w-6 l-2" label="Start" v-model="form.exStartDate"/>
      <ns-date-input class="x-16x y-2 w-3" type="time" v-model="form.exStartTime"/>
      <ns-date-input class="x-10x y-3 w-6 l-2" label="End" v-model="form.exEndDate"/>
      <ns-date-input class="x-16x y-3 w-3" type="time" v-model="form.exEndTime"/>

      <!-- Specific value -->
      <div class="x-5 y-4 w-2 ns-label">Min.</div>
      <div class="x-7 y-4 w-2 ns-label">Max.</div>
      <ns-textbox class="x-1 y-5 w-6 l-4" v-model.trim="form.specMin" label="Specific value" :maxlength="10" enforce-maxlength pattern="^[0-9\s]*$"/>
      <ns-textbox class="x-7 y-5 w-2" v-model.trim="form.specMax" :maxlength="10" enforce-maxlength pattern="^[0-9\s]*$"/>
      <!-- Volume -->
      <div class="x-14x y-4 w-2 ns-label">Min.</div>
      <div class="x-16x y-4 w-2 ns-label">Max.</div>
      <ns-textbox class="x-10x y-5 w-6 l-4" v-model.trim="form.volMin" label="Volume" :maxlength="7" enforce-maxlength pattern="^[0-9\s]*$"/>
      <ns-textbox class="x-16x y-5 w-2" v-model.trim="form.volMax" :maxlength="7" enforce-maxlength pattern="^[0-9\s]*$"/>

      <!-- Criteria -->
      <ns-button class="x-1 y-7 w-4" size="small" style="font-size: 13px;" @click="btnCriteriaExams">Criteria Exams</ns-button>
      <ns-textbox class="x-5 y-7 w-14x" v-model.trim="form.criteriaExam" @keypress="e => moveReadonly(e)" @keydown="e => moveReadonly(e)"/>

      <!-- redio_buttom -->
      <div class="x-1 y-6 ns-label">Reservation</div>
      <ns-radio-group class="x-5 y-6 w-14" v-model="form.redioValue" :options="reservationOption" name="radioType"/>
    </div>

    <!-- Row1 column3 -->
    <div class="ns-panel x-31 y-1" @keydown="e => changeCriteria(e)">
      <div class="x-1 y-1 w-4 ns-label">Display profile</div>
      <ns-dropdown class="x-1 y-2 w-8" v-model="form.displayProfile" :options="profileOption" :keys="{label: 'name', value: 'code'}"/>
      <ns-icon-button class="x-5 y-4 w-2 h-1x" icon="search" @click="checkRows"/>
      <ns-button class="x-7 y-4 w-2 h-1x" @click="btnClear('')"><i class="material-icons symbol-size symbol-color-clear">clear</i></ns-button>
      <div class="x-1 y-7 w-5 ns-label">Max. No of products</div>
      <ns-textbox class="x-7 y-7 w-2" v-model.trim="form.maxProduct" :maxlength="10" enforce-maxlength pattern="^[0-9\s]*$"/>
    </div>

    <!-- Row2 table -->
    <div class="ns-panel x-1 y-7">
      <ns-table
        class="x-1 y-2 w-38"
        :rows="rows"
        :cols="cols"
        :loading="busy"
        :display-rows="13"
        ref="tbStock"
        @row-selected="selectedRow"
        @row-dblclick="btnProductDetail"
      >
        <template slot="c-collect" slot-scope="props">
          <ns-date-input class="x-1" v-if="props.data" v-model="props.data.collect" type="datetime" readonly/>
        </template>
        <template slot="c-expiry" slot-scope="props">
          <ns-date-input class="x-1" v-if="props.data" v-model="props.data.expiry" type="datetime" readonly/>
        </template>
        <template slot="c-extPheno" slot-scope="props">
          <ns-textbox class="x-1" v-if="props.data" v-model="props.data.extPheno" type="text" readonly/>
        </template>
        <template slot="c-Location8" slot-scope="props" v-if="form.displayProfile === '2'">
          <ns-date-input class="x-1" v-if="props.data" v-model="props.data.prodDate" type="date" readonly/>
        </template>
      </ns-table>
    </div>

    <!-- row3 Button -->
    <div class="ns-panel x-1 y-23">
      <ns-button class="x-1 y-1 w-6" size="small" @click="gotoDetail(rowSelect)">Product details</ns-button>
      <ns-button class="x-8 y-1 w-6" size="small" @click="gotoProductSearch(rowSelect)">Product traceability</ns-button>
      <ns-icon-button class="x-15 y-1 w-3" size="small" icon="print" @click="doPrint"/>
      <div class="x-23 y-1 w-4" style="color:blue;">{{ rows.filter(x => x.state === 'A' || x.state === 'B' || x.state === 'D' || x.state === 'E' || x.state === 'P' || x.state === 'Q' || x.state === 'V' || x.state === '**A**').length }} Products</div>
      <div class="x-28 y-1 w-4" style="color:red;">{{ numShow }} Lines</div>
      <!-- <div class="x-32 y-1 w-4" style="color:red;">{{ numShowProd }} Total</div> -->
      <!-- <ns-button class="x-26 y-1 w-3" @click="doPrintStock" size="small" icon="print">Print</ns-button> -->
      <ns-button class="x-35x y-1 w-3" @click="closeStkDis" size="small">Exit</ns-button>
    </div>

    <!-- modal -->
    <ns-modal ref="modalExamList" title="Examination list" size="small" @close="$refs.modalExamList.close()">
      <div class="stock-display-dialog ns-panel w-17 h-16">
        <div class="mask" :class="{loading:dialogLoad}">
          <ns-progress-circular color="multi-color" v-show="dialogLoad" :size="144" :stroke="4"/>
        </div>
        <ExaminationList ref="examinationList" v-if="clickExList === true" :params="form.examList" @close="$refs.modalExamList.close()" @update="updateCriteriaExam"/>
      </div>
    </ns-modal>

    <ns-modal ref="modalLovGroup" title="Group / Sub-group" size="large">
      <div class="stock-display-dialog ns-panel w-20 h-18">
        <ns-table
          ref="tbRowsGroup"
          class="x-1 y-1 w-23"
          :rows="rowsGroup"
          :cols="GroupCols"
          :loading="busy"
          :display-rows="17"
        >
          <template slot="c-selected" slot-scope="props">
            <div class="ns-row" v-if="props.data">
              <ns-checkbox class="x-1 w-1" v-model="props.data.selected" :disabled="props.data.disabled" @change="selectedRowGroup(props.data.code)"/>
            </div>
          </template>
        </ns-table>
        <div class="x-2 y-1">
          <ns-button class="x-1 y-1 w-1" style="left: 3px; border: 0; background: rgba(0, 0, 0, 0)" @click="sortGroup">#</ns-button>
        </div>
        <div class="x-24x y-13" style="flex-direction: column; margin-top: 8px; justify-content: flex-end;">
          <ns-button class="x-1 y-1 w-2 h-1x" @click="selectedRowGroup('all')">all</ns-button>
          <ns-button class="x-1 y-1 w-2 h-1x" style="top: 4px;" @click="selectedRowGroup('clear')">(none)</ns-button>
          <ns-button class="x-1 y-1 w-2 h-1x" style="top: 8px;" color="green" @click="setFormGroup">select</ns-button>
          <ns-button class="x-1 y-2 w-2 h-1x" style="top: 12px;" color="red" @click="closeFormGroup">close</ns-button>
        </div>
      </div>
    </ns-modal>

    <ns-modal title="New app" ref="modalStockDis" dismiss-on="esc" size="small">
      <div class="h-4 w-14 new-app" style="position: relative; height: 140px; width: 484px !important;">
        <div class="ns-panel x-1 y-1">
          <div class="ns-label x-1x y-1 w-14" style="text-align: center;">{{ messageStockDis }}</div>
          <div class="ns-panel x-1 y-4" v-if="modalStockDis === 'ok' || modalStockDis === 'checkCode'">
            <ns-button class="x-7 y-1 w-3 h-1x" ref="modalStockDisOK" @click="modalStockDisOk">OK</ns-button>
          </div>
          <div class="ns-panel x-1 y-4" v-if="modalStockDis === 'yes' || modalStockDis === 'search' || modalStockDis === 'bagSearch'">
            <ns-button class="x-4 y-1 w-4 h-1x" ref="modalStockDisYes" @click="modalStockDisYes">Yes</ns-button>
            <ns-button class="x-9 y-1 w-4 h-1x" @click="modalStockDisNo">No</ns-button>
          </div>
        </div>
      </div>
    </ns-modal>

    <product-detail ref="prodDetDialog" />

    <ns-modal ref="modalProductSearch" title="(F_PRODR2) - Product search" size="small">
      <div class="product-search-dialog">
        <product-search ref="ProductSearch" @close="$refs.modalProductSearch && $refs.modalProductSearch.close()"/>
      </div>
    </ns-modal>

  </div><!-- /main -->
</template>
<script>
import ExaminationList from '~/components/lab/patient-request/examination-list.vue'
import ProductDetail from '~/components/product/product-detail.vue'
import ProductSearch from '~/components/product/product-search.vue'
import moment from 'moment'

export default {
  components: {
    ExaminationList,
    ProductDetail,
    ProductSearch,
  }, // components

  props: {
    param: {
      type: Object,
      required: true,
    },
  }, // props

  data() {
    console.log(this.param)
    return {
      rows: [],
      rowsGroup: [],
      groupList: ['All'],
      busy: false,
      paramData: {},
      bloodGroup: this.$lookup.bloodGroup,
      // select lov
      data: {
        depotCode: ['014'],
        groupCode: ['All'],
        prodCode: [],
        stateCode: ['A'],
        suppleCode: [],
      },

      form: {
        redioValue: 'M',
        displayProfile: '1',
        maxProduct: 30,
        criteriaExam: '',
        examCode: [],

        // code
        depotCode: '014',
        groupCode: 'All',
        prodCode: this.param.prodCode || 'All',
        bagNCode: '',
        stateCode: 'A',
        suppleCode: '',

        colStartDate: '',
        colStartTime: '',
        colEndDate: '',
        colEndTime: '',
        exStartDate: '',
        exStartTime: '',
        exEndDate: '',
        exEndTime: '',

        specMin: '',
        specMax: '',
        volMin: '',
        volMax: '',

        examList: [],
      },

      // show
      numShow: 0,
      numShowProd: 0,
      // modalStockDis
      modalStockDis: '',
      messageStockDis: '',
      clearForm: '',
      saveForm: '',
      rowSelect: {},
      // dialog
      dialogLoad: false,

      clickExList: false,
      formatSample: 'Y',
      copySample: '',
      copyForm: {},
      toggleGroup: false,
    }
  }, // data

  computed: {
    depot() {
      let depot = this.$store.state.master.depot
      return [{ code: 'All       ', name: 'All' }].concat(depot.filter((value, indx) => { if (value.deactiveDate === null && (value.delivery === 'Y' || value.delivery === 'N' || value.allSites === 'Y')) { return value } }))
    }, // depot

    productGroup() {
      let tmp = JSON.parse(JSON.stringify([{ code: 'All', name: 'All' }].concat(this.$store.state.master.productGroup)))
      return tmp.sort((a, b) => (a.code > b.code) ? 1 : ((b.code > a.code) ? -1 : 0))
    }, // productGroup

    productSubgroup() {
      return this.$store.state.master.productSubgroup
    }, // productSubgroup

    depotLookup() {
      // return this.$store.getters['master/depotLookup']
      return this.depot.reduce((prev, item) => {
        prev[item.code] = item
        return prev
      }, {})
    }, // depotLookup

    productLookup() {
      let data = this.product.filter((value, indx) => {
        if (value.inStock === 'T' && value.deactiveDate === null) { return value }
      })
      return data.reduce((prev, item) => {
        prev[item.code] = item
        return prev
      }, {})
    }, // productLookup

    stateLookup() {
      return this.stateData.reduce((prev, item) => {
        prev[item.code] = item
        return prev
      }, {})
    }, // stateLookup

    suppleLookup() {
      let data = this.product.filter((value, indx) => { if (value.groupCode === 'S ') { return value } })
      return data.reduce((prev, item) => {
        prev[item.code] = item
        return prev
      }, {})
    }, // suppleLookup

    product() {
      let sorted = [{ code: 'All       ', name: 'All', inStock: 'T', deactiveDate: null }]
        .concat(JSON.parse(JSON.stringify(
          this.$store.state.master.product.filter((value, indx) => {
            if (value.inStock === 'T' && value.deactiveDate === null) { return value }
          })
        )))
      sorted.sort((a, b) => a.id - b.id)
      return sorted
    }, // product

    paramLabelSetting() {
      return this.$store.getters['master/paramLabelSetting'].filter(x => x.type === 'D' && (x.siteCode === this.selectedSite || x.siteCode === '9999'))
    },

    cols() {
      if (this.form.displayProfile === '2') {
        return {
          depotCode: {
            text: 'Depot',
            width: 50,
          },
          prodCode: {
            text: 'Product',
            width: 68,
          },
          state: {
            text: 'State',
            width: 50,
          },
          sampleNumber: {
            text: 'Bag N',
            width: 125,
          },
          collect: {
            text: 'Collection',
            width: 170,
          },
          expiry: {
            text: 'Expiry',
            width: 170,
          },
          showGroup: {
            text: 'ABODc',
            width: 55,
          },
          extPheno: {
            text: 'Ext Pheno',
          },
          Location8: {
            text: 'Production',
            width: 110,
          },
          donorNumber: {
            text: 'Donor id.',
            width: 110,
          },
        }
      } else {
        return {
          depotCode: {
            text: 'Depot',
            width: 50,
          },
          prodCode: {
            text: 'Product',
            width: 68,
          },
          state: {
            text: 'State',
            width: 50,
          },
          sampleNumber: {
            text: 'Bag N',
            width: 125,
          },
          collect: {
            text: 'Collection',
            width: 170,
          },
          expiry: {
            text: 'Expiry',
            width: 170,
          },
          showGroup: {
            text: 'ABODc',
            width: 55,
          },
          extPheno: {
            text: 'Ext Pheno',
          },
          Location8: {
            text: 'Local.',
            width: 110,
          },
          donorNumber: {
            text: 'Donor id.',
            width: 110,
          },
        }
      }
    }, // cols

    GroupCols() {
      return {
        selected: {
          text: '',
          width: 35,
        },
        numSelected: {
          text: '',
          width: 30,
        },
        code: {
          text: 'Code',
          width: 175,
        },
        name: {
          text: 'Description',
        },
      }
    }, // GroupCols

    reservationOption() { // radio data
      return [
        {label: 'Not used', value: 'M'},
        {label: 'Reserved only', value: 'Y'},
        {label: 'Not reserved only', value: 'N'},
      ]
    }, // reservationOption

    profileOption() { // dropdown
      return [
        {name: 'Stock Display', code: '1'},
        {name: 'Visualisation for HTFDC Pooling', code: '2'},
      ]
    }, // profileOption

    stateData() {
      return [
        { code: 'A', name: 'Active' },
        { code: 'Z', name: 'Active/Block' },
        { code: 'B', name: 'Distributed, delivery on standby' },
        { code: 'D', name: 'To be reclassified' },
        { code: 'E', name: 'Labelling on standby' },
        { code: 'L', name: 'Delivered' },
        { code: 'P', name: 'Production in progress' },
        { code: 'Q', name: 'In quarantine' },
        { code: 'S', name: 'To be discarded' },
        { code: 'U', name: 'Used' },
        { code: 'V', name: 'To be validated' },
        { code: 'X', name: 'Discarded' },
        { code: 'R', name: 'Expired' }, // <--- NEW ADD
        { code: 'M', name: 'Near expiry' },
        { code: 'T', name: 'All status' },
      ].sort()
    }, // stateData
  }, // computed

  watch: {
    param() {
      this.$util.nextTick(() => {
        this.$refs.depot && this.$refs.depot.focus()
      })
    },
  }, // watch

  created() {
    this.clearForm = JSON.stringify(this.form)
  }, // created

  mounted() {
    this.$util.nextTick(() => {
      this.$refs.depot && this.$refs.depot.focus()
    })
  }, // mounted

  methods: {
    moveReadonly(e) {
      if ([37, 39].includes(e.which)) { // Arrow Left & Right
        return true
      } else {
        e.preventDefault()
        return false
      }
    },

    gotoDetail(production) {
      if (!production.stkId) {
        return
      }

      if (this.$refs.prodDetDialog) {
        this.$refs.prodDetDialog.init(production.stkId)
        this.$refs.prodDetDialog.open()
      }
    },

    gotoProductSearch(production) {
      if (!production.sampleNumber) {
        return
      }

      this.$refs.ProductSearch && this.$refs.ProductSearch.setSampleNumber(production.sampleNumber)
      this.$refs.modalProductSearch && this.$refs.modalProductSearch.open()
    },

    async checkRows() {
      if (this.rows.length) {
        this.modalStockDis = 'search'
        this.messageStockDis = 'Attention You will clear the display of selected products. Do you want to continue?'
        this.$refs.modalStockDis.open(() => {
          this.$util.nextTick(() => {
            this.$refs.modalStockDisYes && this.$refs.modalStockDisYes.focus()
          })
        })

        return
      }

      if (this.data['stateCode'].find(x => x === 'R' || x === 'M') && this.data['stateCode'].length > 1) {
        await this.$store.dispatch('showAlert', {
          title: 'Alert!',
          text: 'States M, R or T must be selected alone',
        }).then(() => {
          this.$util.nextTick(() => {
            this.$refs['state'] && this.$refs['state'].focus()
          })
        })

        return
      }

      console.log('ROW => ', this.rows.length)

      if (!this.rows.length) {
        this.btnSearch()
      }
    }, // checkRows

    doText(key) {
      this.data[key + 'Code'] = this.data[key + 'Code'].map(item => item.trim())
      if (key === 'group') {
        this.data[key + 'Code'] = this.groupList
      }
      this.form[key + 'Code'] = this.data[key + 'Code'].join(',')
    }, // doText

    changeDataBak(key) { // TODO: state
      let outCode = []
      this.doPushList(key)
      if (this.form[key + 'Code']) {
        this.data[key + 'Code'].forEach(item => {
          let check = ''
          if (key === 'depot') { check = this.depotLookup[item] ? this.depotLookup[item].code : '' }
          if (key === 'prod') { check = this.productLookup[item] ? this.productLookup[item].code : '' }
          if (key === 'state') { check = this.stateLookup[item] ? this.stateLookup[item].code : '' }
          if (!check) {
            outCode.push(item.trim())
            this.data[key + 'Code'].splice(this.data[key + 'Code'].indexOf(item), 1)
          }
        })

        this.doText(key)

        if (outCode.length === 0) { return }

        let showtext = outCode.join(',')
        this.$refs[key] && this.$refs[key].focus()
        this.modalStockDis = 'checkCode'
        this.messageStockDis = showtext + ' - This code does not exist.'
        this.$refs.modalStockDis.open(() => {
          this.$util.nextTick(() => {
            this.$refs.modalStockDisOK && this.$refs.modalStockDisOK.focus()
          })
        })
      }
    }, // changeDataBak

    changeData(key, e) { // TODO: state
      if (e.key === 'Tab') {
        let outCode = []
        this.doPushList(key)
        if (this.form[key + 'Code']) {
          this.data[key + 'Code'].forEach(item => {
            let check = ''
            if (key === 'depot' && item.trim() === 'All') { return }
            if (key === 'depot') { check = this.depotLookup[item] ? this.depotLookup[item].code : '' }
            if (key === 'prod' && item.trim() === 'All') {
              return
            } else if (key === 'prod') {
              check = this.productLookup[item] ? this.productLookup[item].code : ''
            }
            if (key === 'state') { check = this.stateLookup[item] ? this.stateLookup[item].code : '' }
            if (!check) {
              outCode.push(item.trim())
              this.data[key + 'Code'].splice(this.data[key + 'Code'].indexOf(item), 1)
            }
          })

          this.doText(key)

          if (outCode.length === 0) { return }
          let showtext = outCode.join(',')
          this.$refs[key] && this.$refs[key].focus()
          this.modalStockDis = 'checkCode'
          this.messageStockDis = showtext + ' - This code does not exist.'
          this.$refs.modalStockDis.open(() => {
            this.$util.nextTick(() => {
              this.$refs.modalStockDisOK && this.$refs.modalStockDisOK.focus()
            })
          })
        }
      }
    }, // changeData

    async doPushList(key) {
      this.data[key + 'Code'] = !this.form[key + 'Code'] ? [] : this.form[key + 'Code'].split(/\s*,\s*/).map(x => key === 'group' ? x : x.toUpperCase())

      if (key === 'state') {
        let tmp = this.data.stateCode.filter(x => x === 'T')

        if (tmp.length) {
          this.data.stateCode = tmp
        } else if (this.data.stateCode.length > 1) {
          let ck = this.data.stateCode.findIndex(x => x === 'R' || x === 'M')
          if (ck >= 0) {
            await this.$store.dispatch('showAlert', {
              title: 'Alert!',
              text: 'States M, R or T must be selected alone',
            }).then(() => {
              this.$util.nextTick(() => {
                this.$refs['state'] && this.$refs['state'].focus()
              })
            })

            return
          }
        }

        this.data.stateCode = this.data.stateCode.map(item => item.trim())
        return
      }

      if (key === 'group') {
        let all = this.data.groupCode.find(x => x === 'All')
        if (all) {
          this.data.groupCode = ['All']
          this.form.groupCode = 'All'
          this.groupList = ['All']
        }

        let groupCode = !this.form.groupCode ? [] : this.form.groupCode.split(',')
        console.log('doPushList1', groupCode)
        this.rowsGroup.forEach(item => {
          let code = groupCode.find(obj => obj === item.code.trim())
          console.log('doPushList2', code)
          if (all) {
            item.selected = false
            item.numSelected = null
            item.disabled = false
          } else if (code) {
            item.selected = true
            item.numSelected = null
          }

          this.selectedRowGroup(code)
          // if (row) {
          //   let index = this.data.groupCode.findIndex(x => x === item.code || x === 'ALL')
          //   if (index !== -1) {
          //     item.numSelected = index + 1
          //   }
          //   item.selected = true
          //   return
          // }
          // item.selected = false
          // item.numSelected = null
        })

        if (groupCode.length > 0) {
          this.rowsGroup.sort((a, b) => {
            let ascending = true
            if (a.numSelected === b.numSelected) {
              return 0
            } else if (a.numSelected === null) {
              return 1
            } else if (b.numSelected === null) {
              return -1
            } else if (ascending) {
              return a.numSelected < b.numSelected ? -1 : 1
            } else {
              return a.numSelected < b.numSelected ? 1 : -1
            }
          })
        }

        return
      }

      if (key === 'depot') {
        let item = this.data[key + 'Code'].find(x => x === 'ALL')
        if (item) {
          this.data[key + 'Code'] = ['All']
        }
      }

      if (key === 'prod') {
        let item = this.data[key + 'Code'].find(x => x === 'ALL')
        if (item) {
          this.data[key + 'Code'] = ['All']
        }
      }

      this.data[key + 'Code'] = this.data[key + 'Code'].map(item => item.padEnd(10))
    }, // doPushList

    setRowsGroup() {
      let id = 1
      this.productGroup.forEach(async item => {
        if (this.rowsGroup.length) {
          id = this.rowsGroup.length + 1
        }
        this.rowsGroup.push({
          id: id,
          code: item.code,
          name: item.name,
          selected: false,
          disabled: false,
          numSelected: null,
        })
        this.productSubgroup.forEach(row => {
          if (row.groupCode.padEnd(2) === item.code.padEnd(2)) {
            this.rowsGroup.push({
              id: this.rowsGroup.length + 1,
              code: item.code.trim() + '/' + row.code.trim(),
              name: '--->' + row.name,
              groupCode: row.groupCode,
              selected: false,
              disabled: false,
              numSelected: null,
            })
          }
        })
      })
    }, // setRowsGroup

    selectedRowGroup(code) {
      if (code === 'all') {
        code = ''
        this.rowsGroup.forEach(item => {
          if (item.code === 'All') {
            item.numSelected = 1
            item.selected = true
          } else {
            item.numSelected = null
            item.selected = false
            item.disabled = false
          }
        })

        let index = this.rowsGroup.findIndex(x => x.code === 'All')
        this.$util.nextTick(() => {
          this.$refs['tbRowsGroup'] && this.$refs['tbRowsGroup'].setSelectedIndex(index, true)
        })

        return
      } else if (code === 'clear') {
        code = ''
        this.groupList = []
        this.rowsGroup.forEach(item => {
          item.numSelected = null
          item.selected = false
          item.disabled = false
        })

        this.$util.nextTick(() => {
          this.$refs['tbRowsGroup'] && this.$refs['tbRowsGroup'].setSelectedIndex(0, true)
        })
        return
      }

      let row = this.rowsGroup.find(item => item.code === code)
      if (row && !row.groupCode) {
        this.rowsGroup.forEach(item => {
          if (item.groupCode && (item.groupCode.padEnd(2) === code.padEnd(2))) {
            item.selected = false
            item.disabled = row.selected
          }

          if (item.selected && item.numSelected === null && !this.groupList.find(x => x === item.code)) {
            this.groupList.push(item.code)
            item.numSelected = this.groupList.length
            console.log('item.selected if-1', item.numSelected, item.selected)
          } else if (item.selected === false && item.numSelected !== null) {
            this.groupList.splice(this.groupList.findIndex(x => x === item.code), 1)
            item.numSelected = null
          }
        })
      } else if (row && row.groupCode) {
        this.rowsGroup.forEach(item => {
          if (item.groupCode && (item.groupCode.padEnd(2) === code.padEnd(2))) {
            item.selected = false
            item.disabled = row.selected
          }

          if (item.selected && item.numSelected === null && !this.groupList.find(x => x === item.code)) {
            this.groupList.push(item.code)
            item.numSelected = this.groupList.length
            console.log('item.selected if-2', item.numSelected, item.selected)
          } else if (item.selected === false && item.numSelected !== null) {
            this.groupList.splice(this.groupList.findIndex(x => x === item.code), 1)
            item.numSelected = null
          }
        })
      }

      this.rowsGroup.forEach(item => {
        let index = this.groupList.findIndex(x => x === item.code)
        if (index !== -1) {
          item.numSelected = index + 1
          if (item.code === 'All') {
            item.selected = true
          }
        }
      })
      // console.log('this.groupList =>', this.groupList)
    }, // selectedRowGroup

    setFormGroup() {
      this.data.groupCode = []
      let item = this.groupList.find(x => x === 'All')
      if (item || this.groupList.length === 0) {
        this.data.groupCode = ['All']
        this.form.groupCode = 'All'
        this.groupList = ['All']
        console.log('setFormGroup1')
      } else {
        this.rowsGroup.forEach(item => {
          if (item.selected) {
            this.data.groupCode.push(item.code)
          }
        })
        console.log('setFormGroup2')
      }

      this.data.groupCode.map(item => item.trim())
      this.doText('group')
      this.$refs.modalLovGroup.close()
    }, // setFormGroup

    closeFormGroup() {
      console.log('group_codex', Array.isArray(this.data.groupCode), this.data.groupCode)
      this.groupList = this.data.groupCode

      let all = this.groupList.find(x => x === 'All')
      if (all || this.groupList.length === 0) {
        this.data.groupCode = ['All']
        this.form.groupCode = 'All'
        this.groupList = ['All']
      }

      this.rowsGroup.forEach(item => {
        let code = this.data.groupCode.find(x => x === item.code)
        if (all) {
          item.selected = false
          item.numSelected = null
          item.disabled = false
        }

        this.selectedRowGroup(code)
        // if (index === -1) {
        //   console.log(index)
        //   item.selected = false
        //   item.numSelected = null
        // } else {
        //   item.numSelected = index + 1
        //   item.selected = true
        // }
      })

      this.$refs.modalLovGroup.close()
    },

    sortGroup() {
      this.toggleGroup = !this.toggleGroup
      this.rowsGroup.sort((a, b) => {
        let ascending = this.toggleGroup
        if (a.numSelected === b.numSelected) {
          return 0
        } else if (a.numSelected === null) {
          return 1
        } else if (b.numSelected === null) {
          return -1
        } else if (ascending) {
          return a.numSelected < b.numSelected ? -1 : 1
        } else {
          return a.numSelected < b.numSelected ? 1 : -1
        }
      })
    },

    async checkSample(data) {
      if (!this.form.bagNCode) {
        return
      }

      if (this.form.bagNCodeEnd) {
        if (!this.form.bagNCode) {
          return
        }
      }

      try {
        this.busy = true
        let result = []

        if (this.form.bagNCode && !this.form.bagNCodeEnd) {
          let changeCode = this.form.bagNCode.trim().replace(/\*/g, '%')
          result = await this.$http.post('/lab/lab001/getStockSample', { sampleNumber: [changeCode], maxProduct: this.form.maxProduct })
        }

        if (this.form.bagNCode && this.form.bagNCodeEnd) {
          let changeCode = this.form.bagNCode.trim().replace(/\*/g, '%')
          let changeCodeEnd = this.form.bagNCodeEnd.trim().replace(/\*/g, '%')
          result = await this.$http.post('/lab/lab001/getStockSample', { sampleNumber: [changeCode, changeCodeEnd], maxProduct: this.form.maxProduct })
        }

        if (!result.data.status) {
          throw new Error('stock display change bagN', result.data.error)
        }

        console.log('result checkSample', result.data.bagData)

        if (result.data.bagData.length > 1) {
          if (result.data.bagData[0] === 'Y' && result.data.bagData[1] === 'N') {
            // this.form[data] = ''
            this.$refs['bagNEnd'] && this.$refs['bagNEnd'].focus()
            this.modalStockDis = 'ok'
            this.messageStockDis = 'Sample Number ' + this.form.bagNCodeEnd + ' incorrect'
            this.$refs.modalStockDis.open(() => {
              this.$util.nextTick(() => {
                this.$refs.modalStockDisOK && this.$refs.modalStockDisOK.focus()
              })
            })

            return false
          } else if (result.data.bagData[0] === 'N' && result.data.bagData[1] === 'Y') {
            // this.form[data] = ''
            this.$refs['bagN'] && this.$refs['bagN'].focus()
            this.modalStockDis = 'ok'
            this.messageStockDis = 'Sample Number ' + this.form.bagNCode + ' incorrect'
            this.$refs.modalStockDis.open(() => {
              this.$util.nextTick(() => {
                this.$refs.modalStockDisOK && this.$refs.modalStockDisOK.focus()
              })
            })

            return false
          } else if (result.data.bagData[0] === 'N' && result.data.bagData[1] === 'N') {
            this.form[data] = ''
            this.$refs['bagN'] && this.$refs['bagN'].focus()
            this.modalStockDis = 'ok'
            this.messageStockDis = 'Sample Number incorrect'
            this.$refs.modalStockDis.open(() => {
              this.$util.nextTick(() => {
                this.$refs.modalStockDisOK && this.$refs.modalStockDisOK.focus()
              })
            })

            return false
          } else {
            return true
          }
        } else if (result.data.bagData.length === 1) {
          if (result.data.bagData[0] === 'N') {
            // this.form[data] = ''
            this.$refs['bagN'] && this.$refs['bagN'].focus()
            this.modalStockDis = 'ok'
            this.messageStockDis = 'Sample Number incorrect'
            this.$refs.modalStockDis.open()
            this.$util.nextTick(() => {
              this.$refs.modalStockDisOK && this.$refs.modalStockDisOK.focus()
            })

            return false
          } else {
            return true
          }
        }

        return true
      } catch (e) {
        console.log(e)
        this.$store.commit('setToast', { message: 'error - ' + e.message })
      } finally {
        // this.$emit('load', false)
        this.busy = false
      }
    },

    async changeBagN(data, e) {
      if (!this.form.bagNCode) {
        return
      }

      this.copySample = JSON.stringify(this.form.bagNCode)

      if (this.form.bagNCode && e.key === 'Tab' && data === 'bagN') {
        let changeCode = this.form.bagNCode.trim().replace(/\*/g, '%')

        if (!this.$util.isValidSample(changeCode, this.paramLabelSetting)) {
          this.form[data] = ''
          this.$refs[data] && this.$refs[data].focus()
          this.modalStockDis = 'ok'
          this.messageStockDis = 'Sample Number incorrect'
          this.$refs.modalStockDis.open(() => {
            this.$util.nextTick(() => {
              this.$refs.modalStockDisOK && this.$refs.modalStockDisOK.focus()
            })
          })

          this.formatSample = 'N'
        }
      }
    }, // changeBagN

    async changeBagNEnd(data, e) {
      if (!this.form.bagNCodeEnd) {
        return
      }

      if (this.form.bagNCodeEnd && e.key === 'Tab' && data === 'bagNEnd') {
        let changeCodeEnd = this.form.bagNCodeEnd.trim().replace(/\*/g, '%')

        if (!this.$util.isValidSample(changeCodeEnd, this.paramLabelSetting)) {
          this.form[data] = ''
          this.$refs[data] && this.$refs[data].focus()
          this.modalStockDis = 'ok'
          this.messageStockDis = 'Sample Number incorrect'
          this.$refs.modalStockDis.open(() => {
            this.$util.nextTick(() => {
              this.$refs.modalStockDisOK && this.$refs.modalStockDisOK.focus()
            })
          })

          this.formatSample = 'N'
        }
      }
    }, // changeBagNEnd

    selectedRow(row) {
      this.rowSelect = row
      console.log('row', row)
    }, // selectedRow

    btnProductDetail(row) {
      let stkId = row.stkId ? row.stkId : this.rowSelect.stkId
      if (!stkId) {
        return
      }
      this.paramData = {stkId}
      this.modalStockDis = 'modalProductDetail'
      this.$refs.modalProductDetail && this.$refs.modalProductDetail.open()
    }, // btnProductDetail

    btnCriteriaExams() {
      this.paramData = {
        sampleNumber: this.param.sampleNumber,
      }
      this.clickExList = true
      this.$refs.modalExamList && this.$refs.modalExamList.open(() => {
        this.$util.nextTick(() => {
          this.$refs.examinationList && this.$refs.examinationList.selectedIndex()
        })
      })
    }, // btnCriteriaExams

    updateCriteriaExam(code, examCode, examList) {
      this.form.criteriaExam = ''
      if (code.length > 1) {
        this.form.criteriaExam = code
        this.form.examCode = examCode
        this.form.examList = examList
      }
      this.changeCriteria({key: 'Change'})
    }, // updateCriteriaExam

    async btnSearch() {
      if (this.form.bagNCodeEnd) {
        if (!this.form.bagNCode) {
          await this.$store.dispatch('showAlert', {
            title: 'Require item',
            text: 'Require a Bng N\' Start',
          })
          this.$util.nextTick(() => {
            this.$refs['bagN'] && this.$refs['bagN'].focus()
          })
          return
        }
      }

      try {
        let check = true

        if (this.form.bagNCode) {
          check = await this.checkSample('bagN')
        }

        if (check) {
          this.$emit('load', true)
          this.busy = true
          console.log('search => ', this.form)
          this.saveForm = JSON.stringify(this.form)
          if (this.form.colStartDate && !this.form.colStartTime) { this.form.colStartTime = '00:00' }
          if (this.form.colEndDate && !this.form.colEndTime) { this.form.colEndTime = '23:59' }
          if (this.form.exStartDate && !this.form.exStartTime) { this.form.exStartTime = '00:00' }
          if (this.form.exEndDate && !this.form.exEndTime) { this.form.exEndTime = '23:59' }
          if (!this.form.stateCode) {
            this.form.stateCode = 'A'
          }

          let res1 = await this.$http.post('/production/stock-display/get-stock-search', {
            form: this.form,
            cnt: true,
          })

          if (!res1.data.status) {
            throw new Error('stock display search', res1.data.error)
          }

          console.log('res1.data.cnt:', res1.data.cnt)

          let stock = []
          for (let r = 0; r < res1.data.cnt; r += 1000) {
            this.form.offset = r === 0 ? r : (r + 1000)
            let res2 = await this.$http.post('/production/stock-display/get-stock-search', {
              form: this.form,
              cnt: false,
            }, {timeout: 3600000})
            console.log('res2:', res2)

            stock.push(...res2.data.stock)
            console.log(stock.length)
            if (stock.length >= this.form.maxProduct || stock.length >= res1.data.cnt) {
              console.log(stock)
              break
            }

            if (!res2.data.status) {
              throw new Error('stock display search', res2.data.error)
            }
            await new Promise((resolve, reject) => setTimeout(resolve, 5000))
          }

          // let rawData = []
          // let totalProduct = 0
          // let { data } = await this.$http.post('/lab/lab001/stockSearchPhenotype', res2.data.stock)

          // if (!data.status) {
          //   throw new Error(data.error)
          // }

          // this.currDateTime = moment(res2.data.currDateTime).format('YYYY-MM-DD HH:mm:ss')
          // this.copyForm = JSON.parse(JSON.stringify(this.form))
          // rawData = data.rows
          // console.log(res2.data)

          // // totalProduct = res2.data.products && res2.data.products.sum ? res2.data.products.sum : 0

          // this.rows = rawData.map(item => {
          //   let exp = (item.expiryDate ? item.expiryDate : '') + ' ' + (item.expirytime ? item.expirytime : '')
          //   return {
          //     stkId: item.stkId,
          //     depotCode: item.depotCode,
          //     prodCode: item.prodCode,
          //     state: exp <= this.currDateTime && !['U'].includes(item.state) && ['T'].includes(this.form.stateCode) ? 'R' : item.state,
          //     sampleNumber: item.sampleNumber,
          //     collect: (item.collectDate ? item.collectDate : '') + ' ' + (item.collecttime ? item.collecttime : ''),
          //     expiry: (item.expiryDate ? item.expiryDate : '') + ' ' + (item.expirytime ? item.expirytime : ''),
          //     showGroup: item.rhGroupCode ? this.bloodGroup[item.rhGroupCode.trim()] : '',
          //     extPheno: item.extPheno,
          //     donorNumber: item.donorNumber,
          //     prodDate: item.production,
          //   }
          // })

          // console.log('rows=', this.rows, 'products', totalProduct)

          // this.numShow = this.rows.length
          // this.numShowProd = totalProduct
          // console.log(this.currDateTime)
        }

        // if (!this.form.maxProduct) {
        //   this.form.maxProduct = this.rows.length
        // }

        // if (!this.form.exStartDate && !this.form.exStartTime && !this.form.exEndDate && !this.form.exEndTime && !this.form.colStartDate && !this.form.colStartTime && !this.form.colEndDate && !this.form.colEndTime) {
        //   if (this.form.redioValue === 'M' && !['U'].includes(this.form.stateCode)) {
        //     this.form.exStartDate = moment(this.currDateTime).format('DD-MMM-YYYY')
        //     this.form.exStartTime = moment(this.currDateTime).format('HH:mm')
        //   }
        // }

        // if (this.form.redioValue !== 'M') {
        //   if (!this.form.exStartDate && !this.form.exStartTime && !this.form.exEndDate && !this.form.exEndTime && !this.form.colStartDate && !this.form.colStartTime && !this.form.colEndDate && !this.form.colEndTime) {
        //     this.form.exStartDate = ''
        //     this.form.exStartTime = ''
        //   }
        // }

        // let stateList = this.form.stateCode.split(/(,)/g)
        // let txt = ''
        // stateList.forEach(s => {
        //   txt += !s ? '' : this.stateLookup[s.trim()] ? this.stateLookup[s].name : ''
        // })

        // this.$emit('message', txt)

        // this.$util.nextTick(() => {
        //   this.$refs.tbStock && this.$refs.tbStock.setSelectedIndex(0)
        // })
      } catch (e) {
        console.log(e)
        this.$store.commit('setToast', { message: 'error - ' + e.message })
      } finally {
        this.$emit('load', false)
        this.busy = false
      }
    }, // btnSearch

    btnClear(data) {
      if (!data) {
        this.form = JSON.parse(this.clearForm)
        this.clickExList = false
      }

      if (data === 'bagSearch') {
        this.rows = []
        this.numShow = 0
        this.numShowProd = 0
        this.$emit('message', '')
        return false
      } else {
        this.rows = []
        this.numShow = 0
        this.numShowProd = 0
        this.$emit('message', '')
      }

      this.$util.nextTick(() => {
        this.$refs['depot'] && this.$refs['depot'].focus()
      })
    }, // btnClear

    // modal btn
    modalStockDisOk() {
      if (this.modalStockDis === 'ok') {
        this.modalStockDis = 'yes'
        this.messageStockDis = 'Do you want to search without check-digit control?'
        this.$util.nextTick(() => {
          this.$refs.modalStockDisYes && this.$refs.modalStockDisYes.focus()
        })

        return
      }
      this.$refs.modalStockDis && this.$refs.modalStockDis.close()
    }, // modalStockDisOk

    async modalStockDisYes() {
      this.$refs.modalStockDis && this.$refs.modalStockDis.close()
      // this.formatSample = 'Y'

      if (this.modalStockDis === 'search') {
        if (this.data['stateCode'].find(x => x === 'R' || x === 'M') && this.data['stateCode'].length > 1) {
          await this.$store.dispatch('showAlert', {
            title: 'Alert!',
            text: 'States M, R or T must be selected alone',
          }).then(() => {
            this.rows = []
            this.$nextTick(() => {
              this.$refs['state'] && this.$refs['state'].focus()
            })
          })

          return
        }
        this.btnClear('search')
        return this.btnSearch()
      }

      if (this.modalStockDis === 'bagSearch') {
        this.btnClear('bagSearch')
        // return this.changeBagN('bagN')
      }
    }, // modalStockDisYes

    modalStockDisNo() {
      this.$refs.modalStockDis && this.$refs.modalStockDis.close()
      // this.formatSample = 'Y'

      if (this.modalStockDis === 'search' || this.modalStockDis === 'bagSearch') {
        this.form = this.saveForm ? JSON.parse(this.saveForm) : JSON.parse(this.clearForm)
        return
      }

      if (this.modalStockDis === 'yes') {
        this.form.bagNCodeEnd = ''
        this.form.bagNCode = ''
        this.$util.nextTick(() => {
          this.$refs['bagN'] && this.$refs['bagN'].focus()
        })
      }
    }, // modalStockDisNo

    // lov
    async showLov(key) {
      if (key === 'group') {
        if (!this.rowsGroup.length) {
          await this.setRowsGroup()
        }
        await this.doPushList('group')
        this.$refs.modalLovGroup && this.$refs.modalLovGroup.open()
        this.$util.nextTick(() => {
          this.$refs.tbRowsGroup && this.$refs.tbRowsGroup.setSelectedIndex(0, true)
        })
        return
      }

      await this.doPushList(key)

      let title = ''
      let rows = []
      let cols = {}
      let buttons = {
        'select': {text: 'SELECT', show: true},
        'close': {text: 'CLOSE', show: true},
      }

      switch (key) {
        case 'depot':
          title = 'Depot list'
          rows = this.depot
          cols = {
            code: {text: 'Code', width: 200},
            name: {text: 'name'},
          }
          buttons = {
            'select': {text: 'SELECT', show: true},
            'close': {text: 'CLOSE', show: true},
            'all': {text: 'ALL', show: true},
            'clear': {text: '(NONE)', show: true},
          }
          break
        case 'prod':
          title = 'Product list'
          rows = this.product
          cols = {
            code: {text: 'Code', width: 200},
            name: {text: 'name'},
          }
          buttons = {
            'select': {text: 'SELECT', show: true},
            'close': {text: 'CLOSE', show: true},
            'all': {text: 'ALL', show: true},
            'clear': {text: '(NONE)', show: true},
          }
          break
        case 'state':
          title = 'State list'
          rows = this.stateData
          cols = {
            code: {text: 'Code', width: 200},
            name: {text: 'name'},
          }
          buttons = {
            'select': {text: 'SELECT', show: true},
            'close': {text: 'CLOSE', show: true},
            'all': {text: 'ALL', show: true},
            'clear': {text: '(NONE)', show: true},
          }
          break
        case 'supple':
          title = 'supplements list'
          rows = this.product.filter(value => (value.groupCode === 'S ') ? value : [])
          cols = {
            code: {text: 'Code', width: 200},
            name: {text: 'name'},
          }
          break
      }

      let list = await this.$store.dispatch('showLov', {
        title,
        rows,
        cols,
        selected: this.data[key + 'Code'],
        pk: 'code',
        multi: true,
        ordered: true,
        buttons,
      })
      if (key !== 'state') {
        if (key === 'depot' || key === 'prod') {
          let item = list.find(x => x.trim() === 'All')
          if (item) {
            list = [item]
          }
        }
        this.data[key + 'Code'] = list
      } else {
        let tmp = list.filter(x => x === 'T')
        if (tmp.length) {
          list = tmp
        } else if (list.length > 1) {
          let ck = list.findIndex(x => x === 'R' || x === 'M')

          if (ck >= 0) {
            await this.$store.dispatch('showAlert', {
              title: 'Alert!',
              text: 'States M, R or T must be selected alone',
            }).then(() => {
              this.data[key + 'Code'] = list
              this.doText(key)
              this.$util.nextTick(() => {
                this.$refs['state'] && this.$refs['state'].focus()
              })
            })

            return
          }
        }

        this.data[key + 'Code'] = list
        this.changeCriteria({key: 'Change'})
      }

      this.doText(key)
    }, // showLov

    importRow(rows, totalProduct) {
      console.log('open stock-display')
      this.form.depotCode = ''
      this.form.stateCode = 'T'
      this.rows = rows
      this.form.maxProduct = this.rows.length
      this.numShow = this.rows.length
      this.numShowProd = totalProduct
    },

    closeStkDis() {
      console.log('Close Stock-Display')
      this.btnClear('')
      this.$emit('close')
    },

    async doPrint() {
      // console.log(this.$refs.tbStock.getSortedRows())

      try {
        this.$emit('load', true)
        if (!this.rows.length) {
          console.log('xxxxx')
          return
        }
        let rows = this.rows
        console.log('taoooooo', rows)
        let { data } = await this.$http.post(`/lookback/reportStock`, {
          rows: this.$refs.tbStock.getSortedRows(),
        })
        let print = false
        let url = window.location.href.split('/').slice(0, 3).join('/')

        this.$http.post('http://localhost:3000/docx/print', {
          url: url + data.path,
          print: print,
        }).then(() => {
          this.busy = false
        })
      } catch (error) {
        console.log(error)
      } finally {
        this.$emit('load', false)
      }
    },

    async changeCriteria(e) {
      let char
      let re
      let keyChar
      if (e.which) {
        char = String.fromCharCode(e.which)
        re = /^([A-Za-z0-9_])$/
        keyChar = re.test(char)
      }

      if ((e.key === 'Delete' || e.key === 'Backspace' || e.key === 'Change' || keyChar) && this.rows.length > 0) {
        let confirm = await this.$store.dispatch('showConfirm', {
          title: 'New app',
          text: '<center>Attention You will clear the display of selected products. Do you want to continue?</center>',
          confirmButton: 'Yes',
          denyButton: 'No',
          default: false,
        })

        if (confirm) {
          this.rows = []
          this.numShow = 0
          this.numShowProd = 0
          this.$emit('message', '')
        } else {
          this.form = JSON.parse(JSON.stringify(this.copyForm))
        }
      }
    },
  }, // methods
}
</script>

<style lang="scss">
.stock-display-page {
  .confirm {
    display: flex;
  }
  .stock-display-dialog {
    position: relative;
    > .mask {
      display: none;
      z-index: 5;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      &.loading {
        display: flex;
        background-color: rgba(255, 255, 255, 0.66);
        justify-content: center;
        align-items: center;
      }
    }
  }
  .product-search-dialog {
    position: relative;
    width: 1024px;
    height: 540px;
  }
}
.new-app.ns-modal--size-small
.ns-modal__container {
    width: 35rem;
}
</style>
