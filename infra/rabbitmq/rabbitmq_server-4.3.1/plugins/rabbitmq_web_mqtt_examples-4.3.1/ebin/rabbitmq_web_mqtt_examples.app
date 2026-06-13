{application, 'rabbitmq_web_mqtt_examples', [
	{description, "Rabbit WEB-MQTT - examples"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['rabbit_web_mqtt_examples_app']},
	{registered, []},
	{applications, [kernel,stdlib,rabbit_common,rabbit,rabbitmq_web_dispatch,rabbitmq_web_mqtt]},
	{optional_applications, []},
	{mod, {'rabbit_web_mqtt_examples_app', []}},
	{env, [
	    {listener, [{port, 15670}]}
	  ]}
]}.