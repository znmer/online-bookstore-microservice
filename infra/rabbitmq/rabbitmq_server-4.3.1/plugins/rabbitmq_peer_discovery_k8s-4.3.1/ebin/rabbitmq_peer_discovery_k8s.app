{application, 'rabbitmq_peer_discovery_k8s', [
	{description, "Kubernetes-based RabbitMQ peer discovery backend"},
	{vsn, "4.3.1"},
	{id, "b9d5af1"},
	{modules, ['rabbit_peer_discovery_k8s','rabbitmq_peer_discovery_k8s']},
	{registered, []},
	{applications, [kernel,stdlib,rabbit_common,rabbitmq_peer_discovery_common,rabbit]},
	{optional_applications, []},
	{env, []}
]}.