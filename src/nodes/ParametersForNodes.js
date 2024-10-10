const ParametersForNodes =  [
        {
            type: 'delay',
            inputs: [{
                name: 'delay',
                type: 'number'
            }]
        },
        {
            type: 'pinMode',
            inputs: [{
                name: 'pin',
                type: 'number'
            },{
                name: 'pinMode',
                type: 'select',
                values: ['INPUT', 'OUTPUT']
            }]
        },
        {
            type: 'digitalWrite',
            inputs: [{
                name: 'pin',
                type: 'number'
            },{
                name: 'pinState',
                type: 'select',
                values: ['HIGH', 'LOW']
            }]
        }
    ]
 
export default ParametersForNodes;