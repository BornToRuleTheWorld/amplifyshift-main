import React from "react";
import axios from "axios";
import { components } from 'react-select';

const API_BASE_URL           = "https://amplifyshift.com/api"
const AUTH_TOKEN             = "Token 03aae2170931fbcd414f6c8554d383caafc2dbaa"
const paginationDefaultCount = 10

let data = []
const fetchModules = async() => {
    try{
        const response = await axios.post(`${API_BASE_URL}/GetModules/`,
            { Modules: 
                [
                'Speciality',
                'Language',
                'Discipline',
                'DocSoftware',
                'WorkExp',
                'WorkSetting',
                'JobType',
                'VisitType',
                'Country', 
                'State',
                'QA',
                'Skills'
                ]
            }, 
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': AUTH_TOKEN
                }
          });
          return response.data.data
    }catch(err){
        console.error("Modules fetch error:", err)
    }
}

data = await fetchModules();

console.log('moduleData',data)

const cntryOptions = data['Country'].map((cntry) => {
    return {
        value: cntry.id,
        label:cntry.cntry_name
    }
})

const stateOptions = data['State'].map((state) => {
    return {
        value: state.id,
        label: state.state_name
    }
})

const disciplineOptions = data['Discipline'].map((disp) => {
    return {
        value: disp.id,
        label: disp.disp_name,
        color: disp.color_code
    }
})

const jobTypeOptions = data['JobType'].map((job) => {
    return {
        value: job.id,
        label: job.type_name
    }
})

const docOptions = data['DocSoftware'].map((doc) => {
    return {
        value: doc.id,
        label: doc.doc_soft_name
    }
})

const langOptions = data['Language'].map((lang) => {
    return {
        value: lang.id,
        label: lang.lang_name
    }
})

const specialtyOptions = data['Speciality'].map((spl) => {
    return {
        value: spl.id,
        label: spl.spl_name
    }
})

const visitType = data['VisitType'].map((visit) => {
    return {
        value: visit.id,
        label: visit.visit_name
    }
})

const workExperienceOptions = data['WorkExp'].map((work) => {
    return {
        value: work.id,
        label: work.wkr_name
    }
})

const workSettingOptions = data['WorkSetting'].map((setting) => {
    return{
        value:setting.id,
        label:setting.wrk_set_name
    }
})

const QAOptions = data['QA'].map((qa)=> {
    return {
        value:qa.id,
        label: qa.question
    }
})

const skillsOptions = data['Skills'].map((skill)=> {
    return {
        value:skill.id,
        label: skill.skill_name
    }
})

// const disciplineOptions = [
//     { value: 1, label: 'PT' },
//     { value: 2, label: 'PTA' },
//     { value: 3, label: 'OT' },
//     { value: 4, label: 'COTA' },
//     { value: 5, label: 'SLP' },
// ];

// const docOptions = [
//     { value: 1, label: 'Net Health/Rehab Optima' },
//     { value: 2, label: 'Axxess' },
//     { value: 3, label: 'Kinnser' },
//     { value: 4, label: 'WebPT' },
//     { value: 5, label: 'Other' },
// ];

// const jobTypeOptions = [
//     { value: 1, label: 'Full Time' },
//     { value: 2, label: 'Part Time' },
//     { value: 3, label: 'PRN' },
//     { value: 4, label: 'Contract' },
// ]

// const langOptions = [
//     { value: 1, label: 'Spanish' },
//     { value: 2, label: 'French' },
//     { value: 3, label: 'English' },
//     { value: 4, label: 'Hindi' },
//     { value: 5, lablel: 'Others'}
// ];

// const specialtyOptions = [
//     { value: 1, label: 'Geriatrics' },
//     { value: 2, label: 'Pediatrics' },
//     { value: 3, label: 'Sports Rehab' },
//     { value: 4, label: 'Pelvic Floor Rehab' },
//     { value: 5, label: 'Orthopedics' },
//     { value: 6, label: 'Neuro' },
//     { value: 7, label: 'General' }
// ];

// const visitType = [
//     {value: 1, label:'Evaluation'},
//     {value: 2, label:'Recertification'},
//     {value: 3, label:'Discharge'},
//     {value: 4, label:'Regular Visit'}
// ]

// const workExperienceOptions = [
//     { value: 1, label: 'Skilled Nursing Facility' },
//     { value: 2, label: 'Home Health Services' },
//     { value: 3, label: 'Independent Living Facility' },
//     { value: 4, label: 'Outpatient' },
// ];
  
// const workSettingOptions = [
//     { value:  1, label: 'Hospital' },
//     { value:  2, label: 'Outpatient' },
//     { value:  3, label: 'SNF' },
//     { value:  4, label: 'Home Health' },
//     { value:  5, label: 'School' },
//     { value:  6, label: 'Remote' },
// ]

  const contractHourOptions = [
    {value:"All", label:"All Status"},
    {value:"Active", label:"Active"},
    {value:"Inactive", label:"Inactive"},
    {value:"Cancelled", label:"Cancelled"},
    {value:"Completed", label:"Completed"}
  ]


const shiftColor = [
    {value:"#fcc603", label:"Request"},
    {value:"#41fc03", label:"Contract"}
]

const yearOptions = [
    { value: '0-3', label: '0-3 yrs' },
    { value: '5-10', label: '5-10 yrs' },
    { value: '10+', label: '10+ yrs' },
];
 
const weeklyOptions = [
    { value: '0-10', label: '0-10 Visits' },
    { value: '10-15', label: '10-15 Visits' },
    { value: '15-25', label: '15-25 Visits' },
    { value: '25+', label: '25+ Visits' },
];

const boolOption = [
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
]

const statusOptions = [
    {value:"Inactive", label:"Inactive"},
    {value:"Active", label:"Active"},
]

const requestStatusOption = [
    {value:"New", label:"New"},
    {value:"Open", label:"Open"},
    {value:"Interested", label:"Interested"},
    {value:"Not Interested", label:"Not Interested"},
    {value:"Rejected", label:"Rejected"},
    {value:"Confirmed", label:"Confirmed"}
]

const sortFieldOptions = [
    {value:"created", label:"Created On"},
    {value:"discipline", label:"Discipline"},
    {value:"start_date", label:"Start Date"},
    {value:"end_date", label:"End Date"},
    {value:"city", label:"City"},
    {value:"zipcode", label:"Zipcode"},
    {value:"status", label:"Status"},
    {value:"speciality", label:"Speciality"},
    {value:"work_setting", label:"Work Setting"},
    {value:"job_type", label:"Job Type"},
    {value:"visit_type", label:"Visit Type"},
    {value:"years_of_exp", label:"Experience"},
    {value:"created_by", label:"Created By"}
]

const sortOrderOptions = [
    {value:"desc", label:"Descending"},
    {value:"asc", label:"Ascending"},
]

const ShiftHoursOptions = [
    {value:1, label:"1 Hour"},
    {value:2, label:"2 Hours"},
    {value:3, label:"3 Hours"},
    {value:4, label:"4 Hours"},
    {value:5, label:"5 Hours"},
    {value:6, label:"6 Hours"},
    {value:7, label:"7 Hours"},
    {value:8, label:"8 Hours"}
]

const imageFormat = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "application/msword"
]

//react-select custom style for placeholder
const customStyles = {
    placeholder: (base) => ({
      ...base,
      textAlign: 'center',
    }),
    singleValue: (base) => ({
      ...base,
      textAlign: 'left',
    }),
    option: (base) => ({
      ...base,
      textAlign: 'left',
    }),
    multiValue: (base, state) => ({
      ...base,
      backgroundColor: state.data.color || '#ccc', // use the color code
      color: '#fff',
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#fff',
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#fff',
      ':hover': {
        backgroundColor: '#000',
        color: 'white',
      }
    })
  };

// Custom Option rendering for react-select
const ColourOption = (props) => {
    const { data, innerRef, innerProps } = props;
    return (
        <div ref={innerRef} {...innerProps} style={{ display: 'flex', alignItems: 'center', padding: '5px' }}>
            <div style={{
                backgroundColor: data.color,
                width: 12,
                height: 12,
                borderRadius: '50%',
                marginRight: 10
            }} />
            {data.label}
        </div>
    );
};

// Custom selected value display for react-select
const SingleValue = (props) => {
    const { data } = props;
    return (
        <components.SingleValue {...props}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                    backgroundColor: data.color,
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    marginRight: 10
                }} />
                {data.label}
            </div>
        </components.SingleValue>
    );
};

const MultiValueLabel = (props) => {
    const { data } = props;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{
          backgroundColor: data.color,
          width: 10,
          height: 10,
          borderRadius: '50%',
          marginRight: 6
        }} />
        {data.label}
      </div>
    );
  };


const modulesOption = [
    disciplineOptions, 
    docOptions, 
    jobTypeOptions, 
    langOptions, 
    specialtyOptions, 
    visitType, 
    workExperienceOptions, 
    workSettingOptions,
    cntryOptions,
    stateOptions,
    QAOptions,
    sortFieldOptions,
    sortOrderOptions,
    skillsOptions
]

modulesOption.forEach((module, index) => {
    modulesOption[index] = module.sort((a, b) => (a.label < b.label ? -1 : a.label > b.label ? 1 : 0));
});

export { API_BASE_URL, AUTH_TOKEN, disciplineOptions, docOptions, jobTypeOptions, langOptions,specialtyOptions, visitType, workExperienceOptions, workSettingOptions, yearOptions, weeklyOptions, boolOption, statusOptions, cntryOptions, stateOptions, QAOptions, paginationDefaultCount, fetchModules, customStyles, sortFieldOptions, sortOrderOptions, skillsOptions, imageFormat,ShiftHoursOptions, shiftColor, requestStatusOption, contractHourOptions, ColourOption, SingleValue, MultiValueLabel };
