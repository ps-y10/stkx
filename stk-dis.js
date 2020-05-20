const ctrl = {}
const knex = require('../../lib/knex')('claret')
const util = require('../../lib/util')
const moment = require('dayjs')
const masterModel = require('../../model/master')
const lookup = {}
const context = {stock: []}

module.exports = ctrl

ctrl.getStockSearch = async (req, res) => {
  try {
    await loadLookup()
    console.table(req.body.form)
    const data = req.body.form
    const cnt = req.body.cnt
    const currDateTime = await knex('dual').select(knex.raw(`to_char(sysdate, 'YYYY-MM-DD HH24:MI:SS') as date_time`)).then(row => row[0].dateTime)
    const query = knex('stock as st')
      .leftJoin('donor as d', knex.raw('rpad(st.donor_number, 12)'), 'd.donorNumber')
    if (!data.depotCode || data.depotCode === '') { res.send({status: true}) } // not have depot not search
    if (data.depotCode === 'All') { data.depotCode = '' } // ??
    if (data.groupCode === 'All') { data.groupCode = '' } // ??
    if (data.prodCode === 'All') { data.prodCode = '' } // ??

    // depot
    if (data.depotCode) {
      let depotList = data.depotCode.split(',')
      query.where(function() {
        for (const depot of depotList) {
          this.orWhere('st.depot_code', '=', depot)
        }
      })
    }

    // group
    if (data.groupCode) {
      let prodIn = []
      let groupList = data.groupCode.split(',')
      for (const group of groupList) {
        let prods = lookup.groupAndSubgroup[group.trim()] || []
        if (prods.length) { prodIn.push(...prods) }
      }
      query.where(function() {
        this.whereIn('st.prodCode', prodIn)
      })
    }

    // product
    if (data.prodCode) {
      let prodList = data.prodCode.split(',')
      query.where(function() {
        for (const prod of prodList) {
          this.orWhere('st.prod_code', '=', prod.trim())
        }
      })
    }

    // bag n'
    if (data.bagNCode) {
      if (data.bagNCodeEnd) {
        let tmp1 = data.bagNCode
        let tmp2 = data.bagNCodeEnd
        if (tmp1 > tmp2) {
          data.bagNCode = tmp2
          data.bagNCodeEnd = tmp1
        }

        query.where(function() {
          this.whereBetween('st.sampleNumber', [data.bagNCode, data.bagNCodeEnd])
        })
      } else {
        data.bagNCode = data.bagNCode.trim().replace(/\*/g, '%')
        let checkBegin = data.bagNCode.substr(0, 1)
        let checkEnd = data.bagNCode.substr(data.bagNCode.length - 1, 1)
        data.bagNCode = checkBegin === '%' && checkEnd !== '%' ? data.bagNCode + ' %' : data.bagNCode
        query.where(function() {
          if (checkBegin !== '%' && checkEnd !== '%') {
            this.where('st.sampleNumber', '=', data.bagNCode)
          } else {
            this.where('st.sampleNumber', 'like', data.bagNCode)
          }
        })
      }
    }

    // state
    let stateCode
    let activeBlock
    let active
    if (data.stateCode) {
      query.where(function() {
        if (typeof data.stateCode === 'string' && ['R', 'M', 'T', 'U'].includes(data.stateCode)) {
          stateCode = data.stateCode
        } else {
          stateCode = data.stateCode.split(',')
          activeBlock = stateCode.find(x => x.trim() === 'Z')
          active = stateCode.find(x => x.trim() === 'A')
        }

        if (['T', 'M', ''].includes(stateCode)) {
          stateCode = ['A', 'B', 'D', 'E', 'L', 'P', 'Q', 'S', 'U', 'V', 'X']
        } else if (['R'].includes(stateCode)) {
          stateCode = ['A', 'P']
        } else if (['U'].includes(stateCode)) {
          stateCode = ['U']
        }

        stateCode = stateCode.filter(x => x.trim() !== 'Z')
        if (activeBlock && active) {
          this.whereIn('st.status', stateCode)
        } else if (activeBlock) {
          this.whereIn('st.status', ['A'])
          this.whereNotNull('st.status_block')
        } else if (active && stateCode.length === 1) {
          this.whereIn('st.status', ['A'])
          this.whereNull('st.status_block')
        } else {
          this.whereIn('st.status', stateCode)
        }
      })
    }

    // supplements
    if (data.suppleCode) {
      let suppleCode = data.suppleCode.split(',')
      let foo = function() {
        for (let i = 0; i < suppleCode.length; i++) {
          this.orWhere('pd.suppList2', 'like', knex.raw(`'%${suppleCode[i]}%'`))
        }
      }
      query.innerJoin('product_decompose as pd', knex.raw('rpad(st.prod_code, 10)'), 'pd.code')
        .where(foo)
    }

    // collect date
    if (data.colStartDate || data.colEndDate) {
      query.where(function() {
        this.whereNotNull('st.collect_date')
        if (data.colStartDate && !data.colEndDate) {
          this.where(knex.raw(`'${moment(new Date(data.colStartDate + ' ' + data.colStartTime + ':00')).format('YYYY-MM-DD HH:mm:00')}'`),
            '<=', knex.raw(`to_char(st.collect_date, 'YYYY-MM-DD ') || to_char(st.collect_time, 'HH24:MI:SS')`))
          this.where(knex.raw(`'${moment(new Date(currDateTime)).format('YYYY-MM-DD 23:59:59')}'`),
            '>=', knex.raw(`to_char(st.collect_date, 'YYYY-MM-DD ') || to_char(st.collect_time, 'HH24:MI:SS')`))

          this.where('st.collect_date', '>=', knex.raw(`to_date('${moment(new Date(data.colStartDate + ' ' + data.colStartTime + ':00')).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`))
          this.where('st.collect_date', '<=', knex.raw(`to_date('${moment(new Date(currDateTime)).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`))
        } else if (!data.colStartDate && data.colEndDate) {
          this.where(knex.raw(`'${moment(new Date(data.colEndDate + ' ' + data.colEndTime + ':59')).format('YYYY-MM-DD HH:mm:00')}'`),
            '<=', knex.raw(`to_char(st.collect_date, 'YYYY-MM-DD ') || to_char(st.collect_time, 'HH24:MI:SS')`))

          this.where('st.collect_date', '>=', knex.raw(`to_date('${moment(new Date(data.colEndDate + ' ' + data.colEndTime + ':00')).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`))
        } else {
          this.whereBetween(knex.raw(`to_char(st.collect_date, 'YYYY-MM-DD ') || to_char(st.collect_time, 'HH24:MI:SS')`),
            [knex.raw(`'${moment(new Date(data.colStartDate + ' ' + data.colStartTime + ':00')).format('YYYY-MM-DD HH:mm:00')}'`),
              knex.raw(`'${moment(new Date(data.colEndDate + ' ' + data.colEndTime + ':59')).format('YYYY-MM-DD HH:mm:ss')}'`)])

          this.whereBetween('st.collect_date',
            [knex.raw(`to_date('${moment(new Date(data.colStartDate + ' ' + data.colStartTime + ':00')).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`),
              knex.raw(`to_date('${moment(new Date(data.colEndDate + ' ' + data.colEndTime + ':59')).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`)])
        }
      })
    }

    // expiry date
    if (!['R', 'M'].includes(data.stateCode)) {
      query.where(function() {
        this.whereNotNull('st.expiry_date')
        if ((!data.exStartDate && !data.exEndDate) && (!data.colStartDate && !data.colEndDate) && !['U', 'P'].includes(data.stateCode) && !data.bagNCode) {
          this.where(
            knex.raw(`'${moment(currDateTime).format('YYYY-MM-DD HH:mm:00')}'`),
            '<=', knex.raw(`to_char(st.expiry_date, 'YYYY-MM-DD ') || to_char(st.expiry_time, 'HH24:MI:SS')`))

          this.where('st.expiry_date', '>=', knex.raw(`to_date('${moment(currDateTime).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`))
        } else if (data.exStartDate && !data.exEndDate) {
          this.where(knex.raw(`'${moment(new Date(data.exStartDate + ' ' + data.exStartTime + ':00')).format('YYYY-MM-DD HH:mm:00')}'`),
            '<=', knex.raw(`to_char(st.expiry_date, 'YYYY-MM-DD ') || to_char(st.expiry_time, 'HH24:MI:SS')`))

          this.where('st.expiry_date', '>=', knex.raw(`to_date('${moment(new Date(data.exStartDate + ' ' + data.exStartTime + ':00')).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`))
        } else if (!data.exStartDate && data.exEndDate) {
          this.where(knex.raw(`'${moment(new Date(data.exEndDate + ' ' + data.exEndTime + ':59')).format('YYYY-MM-DD HH:mm:ss')}'`),
            '>=', knex.raw(`to_char(st.expiry_date, 'YYYY-MM-DD ') || to_char(st.expiry_time, 'HH24:MI:SS')`))

          this.where('st.expiry_date', '<=', knex.raw(`to_date('${moment(new Date(data.exEndDate + ' ' + data.exEndTime + ':59')).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`))
        } else if (data.exStartDate && data.exEndDate) {
          this.whereBetween(knex.raw(`to_char(st.expiry_date, 'YYYY-MM-DD ') || to_char(st.expiry_time, 'HH24:MI:SS')`),
            [knex.raw(`'${moment(new Date(data.exStartDate + ' ' + data.exStartTime + ':00')).format('YYYY-MM-DD HH:mm:00')}'`),
              knex.raw(`'${moment(new Date(data.exEndDate + ' ' + data.exEndTime + ':59')).format('YYYY-MM-DD HH:mm:ss')}'`)])

          this.whereBetween('st.expiry_date',
            [knex.raw(`to_date('${moment(new Date(data.exStartDate + ' ' + data.exStartTime + ':00')).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`),
              knex.raw(`to_date('${moment(new Date(data.exEndDate + ' ' + data.exEndTime + ':59')).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`)])
        }
      })
    } else {
      query.where(function() {
        this.whereNotNull('st.expiry_date')
        if (['R'].includes(data.stateCode)) {
          if ((!data.exStartDate && !data.exEndDate)) {
            this.where(
              knex.raw(`'${moment(currDateTime).format('YYYY-MM-DD HH:mm:00')}'`),
              '>=', knex.raw(`to_char(st.expiry_date, 'YYYY-MM-DD ') || to_char(st.expiry_time, 'HH24:MI:SS')`))

            this.where('st.expiry_date', '<=', knex.raw(`to_date('${moment(currDateTime).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`))
          } else if ((data.exStartDate && data.exEndDate) || (data.exStartDate && !data.exEndDate)) {
            this.where(knex.raw(`'${moment(new Date(data.exStartDate + ' ' + data.exStartTime + ':00')).format('YYYY-MM-DD HH:mm:00')}'`),
              '<=', knex.raw(`to_char(st.expiry_date, 'YYYY-MM-DD ') || to_char(st.expiry_time, 'HH24:MI:SS')`))

            this.where(knex.raw(`'${moment(currDateTime).format('YYYY-MM-DD HH:mm:ss')}'`),
              '>=', knex.raw(`to_char(st.expiry_date, 'YYYY-MM-DD ') || to_char(st.expiry_time, 'HH24:MI:SS')`))

            this.where('st.expiry_date', '>=', knex.raw(`to_date('${moment(new Date(data.exStartDate + ' ' + data.exStartTime + ':00')).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`))
            this.where('st.expiry_date', '<=', knex.raw(`to_date('${moment(currDateTime).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`))
          }
        } else if (['M'].includes(data.stateCode)) { // find Expiry curent date to 7 day
          this.whereBetween(knex.raw(`to_char(st.expiry_date, 'YYYY-MM-DD ') || to_char(st.expiry_time, 'HH24:MI:SS')`),
            [knex.raw(`'${moment(currDateTime).format('YYYY-MM-DD HH:mm:ss')}'`),
              knex.raw(`'${moment(currDateTime).add(7, 'd').format('YYYY-MM-DD HH:mm:ss')}'`)])

          this.whereBetween('st.expiry_date',
            [knex.raw(`to_date('${moment(currDateTime).format('YYYY-MM-DD')}', 'YYYY-MM-DD')`),
              knex.raw(`to_date('${moment(currDateTime).add(7, 'd').format('YYYY-MM-DD')}', 'YYYY-MM-DD')`)])
        }
      })
    }

    // specific calue
    if (data.specMax || data.specMin) {
      if (data.specMax && !data.specMin) {
        query.where('st.weight', '<=', data.specMax)
      } else if (!data.specMax && data.specMin) {
        query.where('st.weight', '>=', data.specMin)
      } else {
        query.whereBetween('st.weight', [data.specMin, data.specMax])
      }
    }

    // volume
    if (data.volMax || data.volMin) {
      if (data.volMax && !data.volMin) {
        query.where('st.volume', '<=', data.volMax)
      } else if (!data.volMax && data.volMin) {
        query.where('st.volume', '>=', data.volMin)
      } else {
        query.whereBetween('st.volume', [data.volMin, data.volMax])
      }
    }

    // reservation
    if (data.redioValue === 'Y') {
      query.where(function() {
        this.whereRaw(`(st.reserved_date is not null and st.reserved_date >= sysdate)`)
      })
    } else if (data.redioValue === 'N') {
      query.where(function() {
        this.whereRaw(`st.reserved_date is null or st.reserved_date < sysdate`)
      })
    }

    query.select([
      'st.stkId',
      'st.depotCode', // depot
      'st.prodCode', // product
      knex.raw(`decode(st.status,'A',decode(st.status_block,null,'A','**A**'), st.status) as state`),
      'st.status_block',
      'st.sampleNumber', // bagN
      'st.collectDate',
      knex.raw(`to_char(st.collect_time,'HH24:MI:SS') as collectTime`),
      'st.expiryDate',
      'd.rhGroupCode',
      knex.raw(`to_char(st.expiry_time,'HH24:MI:SS') as expiryTime`),
      'd.donorNumber',
      knex.raw(`st.production_date || ' ' || to_char(st.production_time,'HH24:MI:SS') as production`),
    ])

    // console.log(await query.toSQL())
    if (cnt) {
      let cnt = await knex(query).count('* as cnt').then(r => r[0].cnt || 0)
      return res.send({
        status: true,
        cnt,
      })
    }

    context.stock = await query.offset(data.offset).limit(1000)
    if (data.criteriaExam) { context.criteriaExam = data.criteriaExam }
    await ctrl.checkStock(context)
    // console.log(lookup.examAndResult)
    return res.send({
      status: true,
      stock: context.stock,
    })
  } catch (error) {
    console.log('ERROR getStockSearch():', error)
    res.send({
      status: false,
      error: error.message,
    })
  }
}

ctrl.checkStock = async (context) => {
  let examList = ['DABO', 'AGDTDM']
  for (let i = 0; i < context.stock.length; i += 1000) {
    lookup.examAndResult = await examAndResult(context.stock.slice(i, i + 1000), examList)
  }
}

async function examAndResult(chunk, examList) {
  let query = knex.raw(`with t1 as (
    select dx.sample_number, dx.exam_code, dx.qual_result result, dx.quant_result, dx.lab_date result_date
    from stock st
    join donate_exam dx on dx.donor_number=rpad(st.donor_number, 12) and dx.exam_code in (${examList.map(exam => `'${exam.trim().padEnd(6)}'`)})
    where st.sample_number in (${chunk.map(r => `'${r.sampleNumber}'`).join(',')})
    union all
    select sx.sample_number, sx.exam_code, sx.qual_result result, sx.quant_result, sx.result_date
    from sample_exam sx
    where sx.sample_number in (${chunk.map(r => `'${r.sampleNumber.trim().padEnd(20)}'`).join(',')}) and sx.exam_code in (${examList.map(exam => `'${exam.trim().padEnd(6)}'`)})
    union all
    select st.sample_number, sx.exam_code, sx.qual_result result, sx.quant_result, sx.result_date
    from stock st
    join sample s on s.owner_number=trim(st.stk_id)
    join sample_exam sx on sx.sample_number=s.sample_number and sx.exam_code in (${examList.map(exam => `'${exam.trim().padEnd(6)}'`)})
    where st.sample_number in (${chunk.map(r => `'${r.sampleNumber}'`).join(',')}) and s.owner_type='Q'
    union all
    select st.sample_number, sle.exam_code, sle.result, sle.quant_result, sle.last_deter_date result_date
    from stock st
    join stock_latest_exam sle on st.stk_id=sle.stk_id and sle.exam_code in (${examList.map(exam => `'${exam.trim().padEnd(6)}'`)})
    where st.sample_number in (${chunk.map(r => `'${r.sampleNumber}'`).join(',')})
) select * from t1 where result is not null order by result_date asc`)
  return query.then(rows => rows.reduce((p, r) => {
    const no = r.sampleNumber.trim()
    const exam = r.examCode.trim()
    if (!p[no]) { p[no] = {} }
    if (!p[no][exam]) { p[no][exam] = {} }
    p[no][exam] = r
    return p
  }, {}))
}

async function loadLookup() {
  let all = []
  if (!lookup.product) {
    all.push(masterModel.loadTable('product').then(rows => {
      lookup.product = rows.reduce((p, r) => {
        p[r.code.trim()] = r
        return p
      }, {})
    }))
  }
  if (!lookup.groupAndSubgroup) {
    all.push(masterModel.loadTable('product').then(rows => {
      lookup.groupAndSubgroup = rows.reduce((p, r) => {
        if (r.groupCode.trim() === (r.subgroupCode && r.subgroupCode.trim()) || (r.groupCode && !r.subgroupCode)) {
          if (!p[r.groupCode.trim()]) {
            p[r.groupCode.trim()] = []
          }
          p[r.groupCode.trim()].push(r.code.trim())
        } else if (r.groupCode.trim() !== (r.subgroupCode && r.subgroupCode.trim())) {
          if (!p[r.groupCode.trim() + '/' + r.subgroupCode.trim()]) {
            p[r.groupCode.trim() + '/' + r.subgroupCode.trim()] = []
          }
          p[r.groupCode.trim() + '/' + r.subgroupCode.trim()].push(r.code.trim())
        }
        return p
      }, {})
    }))
  }
  if (!lookup.exam) {
    all.push(masterModel.loadTable('exam').then(rows => {
      lookup.exam = rows.reduce((p, r) => {
        p[r.code.trim()] = r
        return p
      }, {})
    }))
  }

  await Promise.all(all)
  return lookup
}
